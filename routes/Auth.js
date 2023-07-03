const Auth = require("express").Router();

const {
  login,
  resetPassword,
  confirmResetPassword,
} = require("../controllers/Auth.controller");
const { isAuth } = require("../middlewares/auth/auth");

Auth.post("/resetPassword", use(resetPassword));
Auth.post("/confirmResetPassword", use(confirmResetPassword));
