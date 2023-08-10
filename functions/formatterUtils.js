const { v4: uuidv4 } = require("uuid");

async function formatCategory(oldFormat, idCompany) {
  let newFormat = {
    id: uuidv4(),
    idCompany,
    name: oldFormat.title,
    image: oldFormat.categoryLogo,
    importedId: oldFormat.id,
    importedFrom: "jumia",
  };

  return newFormat;
}
async function formatOrder(oldFormat, idJumiaOrder, idCompany) {
  let newFormat = {
    id: uuidv4(),
    idCompany,
    platform: "jumia",
    importedFrom: "jumia",
    status: oldFormat.statusFlow[oldFormat.statusFlow.length - 1].code,
    idJumiaOrder,
    reference: oldFormat.code,
    createdAt: oldFormat.createdAt,
    statusFlow: oldFormat.statusFlow,
    productsTotalPrice: oldFormat.subtotalValue,
    tva: oldFormat.vatAmount,
    deliveryFee: oldFormat.deliveryFee,
    totalPrice: oldFormat.totalValue,
    paymentMethod: oldFormat.paymentType.isOnlinePayment ? "online" : "cash",
    products: oldFormat.products,
    vendorName: oldFormat.vendorName,
    vendorPhone: oldFormat.vendorPhone,
    isPickup: oldFormat.isPickup,
    restaurant: oldFormat.vendorId,
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
    image: oldFormat.productImage,
    importedFrom: "jumia",
    importedId: oldFormat.id,
  };

  return newFormat;
}

module.exports = {
  formatOrder,
  formatCategory,
  formatProducts,
};
