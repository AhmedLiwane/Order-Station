const User = require("express").Router();

const {
  signup,
  login,
  googleAuth,
  facebookAuth,
} = require("../controllers/user.controller");
// const { isUser } = require("../middlewares/User/isUser");

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
User.post("/OAuth", use(googleAuth));
User.post("/fbAuth", use(facebookAuth));
User.post("/signup", use(signup));
User.post("/login", use(login));

module.exports = User;
