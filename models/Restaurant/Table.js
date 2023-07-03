const mongoose = require("mongoose");
const { Schema } = mongoose;

const Table = new Schema({
  id: { type: String, require: true },
  number: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now() },
  isAvailable: { type: Boolean, default: true },
  isPickup: { type: Boolean, default: false },
  isArchvied: { type: Boolean, default: false },
  qrcode: { type: String, default: "" },
  restaurant: { type: String, default: "" },
  waiter: { type: String, default: "" },
  order: { type: Object, default: "" },
});

const TableModel = mongoose.model("Table", Table);
module.exports = TableModel;
