const User = require("express").Router();

const {
  login,
  getOrders,
  viewOrder,
  updateStatus,
} = require("../controllers/User.controller");
const { isUser } = require("../middlewares/User/isUser");

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
/* User Auth */
User.post("/login", use(login));

/* CRUD Orders */
User.get("/getOrders", use(isUser), use(getOrders));
User.get("/viewOrder/:id", use(isUser), use(viewOrder));
User.put("/updateStatus/:id", use(isUser), use(updateStatus));

module.exports = User;
