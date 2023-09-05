const { v4: uuidv4 } = require("uuid");

async function formatCategory(oldFormat, idCompany) {
  let newFormat = {
    id: uuidv4(),
    idCompany,
    name: oldFormat.title,
    image: oldFormat.categoryLogo,
    description: oldFormat.description,
    importedId: oldFormat.id,
    importedFrom: "jumia",
  };

  return newFormat;
}

async function formatSupplement(oldFormat, idCompany) {
  let newFormat = {
    id: uuidv4(),
    isSupplement: true,
    idCompany,
    name: oldFormat.product.name,
    price: oldFormat.price,
    image: oldFormat.product.productImage,
    importedId: oldFormat.product.id,
    importedFrom: "jumia",
  };

  return newFormat;
}

async function formatIngredient(oldFormat, idCompany) {
  let newFormat = {
    id: uuidv4(),
    isSupplement: false,
    idCompany,
    name: oldFormat.name,
    image: oldFormat.productImage,
    importedId: oldFormat.id,
    importedFrom: "jumia",
  };

  return newFormat;
}

async function formatVendor(oldFormat, idCompany) {
  let newFormat = {
    id: uuidv4(),
    idCompany,
    address: oldFormat.addressLine1,
    phone: oldFormat.customerPhone.match(/\d+/g).join(""),
    latitude: oldFormat.latitude,
    longitude: oldFormat.longitude,
    name: oldFormat.name,
    importedId: oldFormat.id,
    importedFrom: "jumia",
    visiblity: {
      glovo: false,
      jumia: true,
      onPlace: false,
    },
  };

  return newFormat;
}

async function formatOrder(oldFormat, idJumiaOrder, idCompany) {
  const dateObject = new Date(oldFormat.createdAt);

  // Convert to UTC before saving
  const utcDateString = dateObject.setHours(dateObject.getHours() + 1);

  const transformedAndAdjustedData = oldFormat.statusFlow.map((item) => {
    const date = new Date(item.date);
    date.setHours(date.getHours() + 1); // Add one hour
    return {
      ...item,
      date: date,
    };
  });

  let newFormat = {
    id: uuidv4(),
    idCompany,
    platform: "jumia",
    importedFrom: "jumia",
    importedId: oldFormat.id,
    statusFlow: transformedAndAdjustedData,
    idJumiaOrder,
    reference: oldFormat.code,
    createdAt: utcDateString,
    productsTotalPrice: oldFormat.subtotalValue,
    tva: oldFormat.vatAmount,
    deliveryFee: oldFormat.deliveryFee,
    totalPrice: oldFormat.totalValue,
    paymentMethod: oldFormat.paymentType.isOnlinePayment ? "online" : "cash",
    isPickup: oldFormat.isPickup,
    customerName: oldFormat.customerName,
    customerComment: oldFormat.customerComment,
  };

  return newFormat;
}

async function formatProducts(oldFormat, idCompany) {
  let newFormat = {
    id: uuidv4(),
    idCompany,
    name: oldFormat.name,
    description: oldFormat.description,
    category: oldFormat.category,
    // supplements: oldFormat.variations[0].toppings,
    price: oldFormat.variations[0].price,
    image: oldFormat.productImage,
    importedFrom: "jumia",
    importedId: oldFormat.id,
  };

  return newFormat;
}

module.exports = {
  formatSupplement,
  formatIngredient,
  formatOrder,
  formatVendor,
  formatCategory,
  formatProducts,
};
