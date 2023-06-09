const mongoose = require("mongoose");
const { Schema } = mongoose;

const Category = new Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  isAvailable: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  image: { type: String, default: "" },
  restaurant: { type: String, default: "" },
});

const CategoryModel = mongoose.model("Category", Category);
module.exports = CategoryModel;
