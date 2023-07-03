const mongoose = require("mongoose");
const { Schema } = mongoose;

const Ingrediant = new Schema({
  id: { type: String, require: true },
  name: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  amount: { type: Number, default: 0 },
  unit: { type: String, default: "" },
  price: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  isSupplement: { type: Boolean },
  image: { type: String, default: "" },
  restaurant: { type: String, default: "" },
  visiblity: {
    glovo: { type: Boolean },
    jumia: { type: Boolean },
    onPlace: { type: Boolean },
  },
});

const IngrediantModel = mongoose.model("Ingrediant", Ingrediant);
module.exports = IngrediantModel;
