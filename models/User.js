const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notification = new Schema({
  id: { type: String, require: true },
  createdAt: { type: String, default: Date.now() },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
});

const User = new Schema({
  id: { type: String, require: true, index: { unique: true } },
  creationDate: { type: Date, default: new Date().toUTCString() },
  fullName: { type: String, require: true, default: "" },
  address: { type: String, default: "" },
  email: { type: String, require: true, default: "" },
  phoneNumber: { type: Number, require: true },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  isVerified: { type: Boolean, Default: false },
  otp: { type: String, default: "" },
  zipCode: { type: Number, default: 1000 },
  token: { type: String, default: "" },
  password: { type: String, require: true, default: "" },
  loginHistory: { type: Array, default: [] },
  transactions: { type: Array, default: [] },
  isArchived: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  paymentHistory: { type: Array, default: [] },
  withdrawHistory: { type: Array, default: [] },
  authMethod: { type: String, default: "regular" },
  picture: { type: String, default: "" },
  notifications: { type: Array, default: [Notification] },
  cardDetails: {
    cardNumber: { type: String, default: "" },
    expDate: { type: String, default: "" },
    ccv: { type: String, default: "" },
  },
  walletDetails: { type: Object },
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
