const mongoose = require("mongoose");
const { Schema } = mongoose;

const Product = new Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  composable: { type: Boolean, default: false },
  choices: {
    question: { type: String, default: "" },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    ingrediants: { type: Array, default: [] },
  },
  ingrediants: { type: Array, default: [] },
  foodCost: { type: Number, default: 0 },
  category: { type: String, default: "" },
  price: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  promoPrice: { type: Number },
  image: { type: String, default: "" },
  restaurant: { type: String, default: "" },
  visiblity: {
    glovo: { type: Boolean },
    jumia: { type: Boolean },
    onPlace: { type: Boolean },
  },
});

const ProductModel = mongoose.model("Product", Product);
module.exports = ProductModel;
