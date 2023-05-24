const User = require("express").Router();

const {
  signup,
  login,
  facebookAuth,
  googleAuth,
  authenticateGoogle,
  googleCallback,
} = require("../controllers/user.controller");
// const { isUser } = require("../middlewares/User/isUser");

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
User.post("/googleAuth", use(googleAuth));
User.post("/fbAuth", use(facebookAuth));
User.post("/signup", use(signup));
User.post("/login", use(login));
User.get("/google2auth", authenticateGoogle);
User.get("/google2auth/callback", googleCallback);

module.exports = User;
