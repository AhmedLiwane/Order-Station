const JumiaOrderModel = require("../models/Partners/JumiaOrder");
const RestaurantModel = require("../models/Restaurant/Restaurant");
const OrderModel = require("../models/Restaurant/Order");
const ProductModel = require("../models/Restaurant/Product");
const IngredientModel = require("../models/Restaurant/Ingredient");
const { formatOrder } = require("./formatterUtils");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// This array will hold the fetched orders to avoid duplicates
let fetchedOrders = [];

// Fetch new orders and emit to Socket.IO
const fetchAndEmitOrders = async (idCompany, headers) => {
  try {
    let ordersToSend = [];
    const newOrders = await axios.get(
      `https://vendor-global-api.food.jumia.com.tn/v1/orders/new?limit=10&page=1`,
      { headers }
    );

    const orderList = newOrders.data;
    if (orderList.length > 0) {
      const myPromise = orderList.map(async (order) => {
        await axios
          .get(
            `https://vendor-global-api.food.jumia.com.tn/v1/orders/${order.id}`,
            { headers }
          )
          // Fetched order details
          .then(async (orderResult) => {
            const orderJumia = orderResult.data;
            const foundJumiaOrder = await JumiaOrderModel.findOne({
              "details.id": orderJumia.id,
            });
            // If Jumia order doesn't exist, add it
            if (!foundJumiaOrder && !fetchedOrders.includes(orderJumia.id)) {
              fetchedOrders.push(orderJumia.id);
              const idJumiaOrder = uuidv4();
              let newJumiaOrder = new JumiaOrderModel({
                id: idJumiaOrder,
                details: orderJumia,
              });
              // Sync Jumia's order to our order schema
              const formattedValues = await formatOrder(
                orderJumia,
                idJumiaOrder,
                foundCompany.id
              );
              let newOrder = new OrderModel(formattedValues);
              // Replace Jumia's vendor id with our vendor's id
              const foundVendor = await RestaurantModel.findOne({
                idCompany,
                importedFrom: "jumia",
                importedId: orderJumia.vendorId,
              });
              newOrder.restaurant = foundVendor.id;
              // Push order's id to the respective vendor
              foundVendor.orders.push(newOrder.id);
              // Sync Jumia's order's products with our product order schema
              let products = [];
              const productsPromise = orderJumia.products.map(
                async (product) => {
                  let object = {
                    product: "",
                    quantity: 0,
                    extra: [],
                    choices: [],
                  };
                  // Replace Jumia's product id with our product's id
                  const foundProduct = await ProductModel.findOne({
                    importedFrom: "jumia",
                    importedId: product.productId,
                    idCompany,
                  });
                  object.product = foundProduct.id;
                  object.quantity = product.quantity;
                  // Format choices & toppings id's as our choices & supplements id's
                  const toppingsArray = Object.values(
                    product?.extras?.toppings
                  ).flatMap((toppingGroup) => {
                    return toppingGroup.map((topping) => topping.productId);
                  });
                  const choicesArray = Object.values(
                    product?.extras?.choices
                  ).flatMap((choiceGroup) => {
                    return choiceGroup.map((choice) => choice.productId);
                  });
                  const foundSupplements = await IngredientModel.find({
                    importedId: { $in: toppingsArray },
                    importedFrom: "jumia",
                    idCompany,
                  });
                  foundSupplements.map((supplement) =>
                    object.extra.push(supplement.id)
                  );
                  const foundIngredients = await IngredientModel.find({
                    importedId: { $in: choicesArray },
                    importedFrom: "jumia",
                    idCompany,
                  });
                  foundIngredients.map((ingredient) =>
                    object.choices.push(ingredient.id)
                  );
                  products.push(object);
                }
              );
              await Promise.all(productsPromise);
              newOrder.products = products;
              foundCompany.orders.push(newOrder.id);
              ordersToSend.push(newOrder);
              await foundCompany.save();
              await foundVendor.save();
              await newOrder.save();
              await newJumiaOrder.save();
            }
          });
      });
      await Promise.all(myPromise);
    }
    return ordersToSend;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

module.exports = { fetchAndEmitOrders };
