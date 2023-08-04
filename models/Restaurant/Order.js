const mongoose = require("mongoose");
const { Schema } = mongoose;

const Product = new Schema({
  productID: { type: String },
  choices: { type: Array },
  quantity: { type: Number, default: 1 },
  extra: { type: Array },
  customerName: { type: String },
  customerNote: { type: String },
});

const Order = new Schema({
  id: { type: String, require: true },
  reference: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: String, default: "" },
  status: { type: String, default: "" }, // New - Accepted - Ready - Refused - Paid
  platform: { type: String, default: "" },
  productsTotalPrice: { type: Number, default: 0 },
  tva: { type: Number, default: 7 },
  deliveryFee: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  usedCoupon: { type: String, default: "" },
  discountedAmount: { type: Number },
  leftToPayPrice: { type: Number },
  paymentMethod: { type: String, default: "" },
  products: { type: [Product], default: [] },
  waiter: { type: String, default: "" },
  table: { type: String, default: "" },
  pickupCode: { type: String, default: "" },
  deliveryPerson: { type: String, default: "" },
  restaurant: { type: String, default: "" },
});

const OrderModel = mongoose.model("Order", Order);
module.exports = OrderModel;
