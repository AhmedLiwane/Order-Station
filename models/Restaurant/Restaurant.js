const mongoose = require("mongoose");
const { Schema } = mongoose;

const Restaurant = new Schema({
  id: { type: String, require: true, index: { unique: true } },
  idCompany: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  name: { type: String, require: true },
  description: { type: String, default: "" },
  specialty: { type: String, require: true },
  address: { type: String, default: "" },
  responsible: { type: String, default: "" },
  email: { type: String, require: true },
  phone: { type: String, default: "" },
  transactions: { type: Array, default: [] },
  isArchived: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  logo: { type: String, default: "" },
  cover: { type: String, default: "" },
  latitude: { type: Number, default: "" },
  longitude: { type: Number, default: "" },
  importedFrom: { type: String, default: "" },
  importedId: { type: String, default: "" },
  visibility: {
    glovo: { type: Boolean, default: false },
    jumia: { type: Boolean, default: false },
    onPlace: { type: Boolean, default: false },
  },
  bankDetails: {
    cardNumber: { type: String, default: "" },
    expDate: { type: String, default: "" },
    ccv: { type: String, default: "" },
  },
  menu: { type: Array, default: [] },
  products: { type: Array, default: [] },
  ingredients: { type: Array, default: [] },
  categories: { type: Array, default: [] },
  coupons: { type: Array, default: [] },
  orders: { type: Array, default: [] },
  choices: { type: Array, default: [] },
  tables: { type: Array, default: [] },
  waiters: { type: Array, default: [] },
});

const RestaurantModel = mongoose.model("Restaurant", Restaurant);
module.exports = RestaurantModel;
