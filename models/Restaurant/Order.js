const mongoose = require("mongoose");
const { Schema } = mongoose;

const Order = new Schema({
  id: { type: String, require: true },
  reference: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: String, default: "" },
  status: { type: String, default: "" },
  platform: { type: String, default: "" },
  orderPrice: { type: Number, default: 0 },
  TVA: { type: Number, default: 0 },
  deliveryFees: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  usedCoupon: { type: String, default: "" },
  paymentType: { type: String, default: "" },
  paymentMethod: { type: String, default: "" },
  products: { type: Array, default: [] },
  waiter: { type: String, default: "" },
  table: { type: String, default: "" },
  pickupCode: { type: String, default: "" },
  deliveryPerson: { type: String, default: "" },
  restaurant: { type: String, default: "" },
});

const OrderModel = mongoose.model("Order", Order);
module.exports = OrderModel;
