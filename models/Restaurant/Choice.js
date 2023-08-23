const mongoose = require("mongoose");
const { Schema } = mongoose;

const Choice = new Schema({
  id: { type: String, require: true },
  idCompany: { type: String, require: true },
  question: { type: String, default: "" },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 },
  choices: { type: Array, default: [] },
  products: { type: Array, default: [] },
  restaurants: { type: Array, default: [] },
});

const ChoiceModel = mongoose.model("Choice", Choice);
module.exports = ChoiceModel;
