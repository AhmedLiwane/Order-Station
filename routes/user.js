const User = require("express").Router();

const {
  login,
  getOrders,
  viewOrder,
  updateStatus,
  createVendor,
  getVendors,
  editVendor,
  archiveVendor,
  updateVendor,
  test,
} = require("../controllers/User.controller");
const { isUser } = require("../middlewares/User/isUser");

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
/* User Auth */
User.post("/login", use(login));

/* CRUD Vendor*/
User.post("/createVendor", use(isUser), use(createVendor));
User.get("/getVendors", use(isUser), use(getVendors));
User.put("/editVendor/:id", use(isUser), use(editVendor));
User.put("/archiveVendor/:id", use(isUser), use(archiveVendor));
User.post("/updateVendor/:id/:action", use(isUser), use(updateVendor));
// User.post("/test/:id/:test", use(test));

/* CRUD Orders */
User.get("/getOrders", use(isUser), use(getOrders));
User.get("/viewOrder/:id", use(isUser), use(viewOrder));
User.put("/updateStatus/:id", use(isUser), use(updateStatus));

module.exports = User;
