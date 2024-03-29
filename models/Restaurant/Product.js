const mongoose = require("mongoose");
const { Schema } = mongoose;

const Product = new Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now() },
  composable: { type: Boolean, default: false },
  choices: { type: Array, default: [] },
  supplements: { type: Array, default: [] },
  defaultIngredients: { type: Array, default: [] },
  foodCost: { type: Number, default: 0 },
  category: { type: String, default: "" },
  price: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  promoPrice: { type: Number, default: 0 },
  importedFrom: { type: String, default: "" },
  importedId: { type: String, default: "" },
  image: { type: String, default: "" },
  priority: { type: Number, default: 1 },
  sales: { type: Number, default: 0 },
  restaurants: { type: Array, default: [] },
  visibility: {
    glovo: { type: Boolean },
    jumia: { type: Boolean },
    onPlace: { type: Boolean },
  },
});

const ProductModel = mongoose.model("Product", Product);
module.exports = ProductModel;
