const UserModel = require("../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const parser = require("ua-parser-js");
const CompanyModel = require("../models/Company/Company");
const OrderModel = require("../models/Restaurant/Order");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        message: "Please provide a valid user !",
        code: 400,
        requestDate: Date.now(),
        success: false,
      });
    }
    const foundUser = await UserModel.findOne({
      email,
      isArchived: false,
      isActive: true,
    });
    const ua = parser(req.headers["user-agent"]);

    if (!foundUser) {
      return res.status(404).send({
        message:
          "This user dosent exist in the database , please verify and send again",
        code: 404,
        requestDate: Date.now(),
        success: false,
      });
    }
    if (!foundUser.isActive)
      return res.status(401).send({
        message:
          "Your account has been disabled. Please contact support for more informations.",
        code: 401,
        requestDate: Date.now(),
        success: false,
      });
    bcrypt.compare(password, foundUser.password, async (err, data) => {
      //if error than throw error
      if (err) throw err;

      //if both match than you can do anything
      if (data) {
        foundUser.loginHistory.push({
          date: Date.now(),
          device: ua,
          ip: req.ip,
          success: true,
        });

        const token = jwt.sign(
          { id: foundUser.id, email, role: foundUser.role },
          process.env.SECRET_KEY,
          {
            expiresIn: "30d",
          }
        );
        foundUser.save();
        res.cookie("x-order-token", token);

        return res.status(200).json({
          message: "Login success",
          code: 200,
          success: true,
          date: Date.now(),
        });
      } else {
        foundUser.loginHistory.push({
          date: Date.now(),
          device: ua,
          ip: req.ip,
          success: false,
        });
        await foundUser.save();

        return res
          .status(401)
          .json({ message: "Invalid credential", code: 401, success: false });
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        "This error is coming from login endpoint, please report to the sys administrator !",
      code: 500,
      success: false,
      date: Date.now(),
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const token = req["cookies"]["x-order-token"];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    const foundUser = await UserModel.findOne({
      id: user.id,
    });
    const foundCompany = await CompanyModel.findOne({
      id: foundUser.idCompany,
    });
    if (!foundUser) {
      return res.status(404).send({
        message: "User not found",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    if (!foundCompany || !foundCompany.users.includes(foundUser.id)) {
      return res.status(404).send({
        message: "You don't belong to a company",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    const foundOrders = await OrderModel.find({
      id: foundCompany.id,
    }).select("-__v -_id");
    if (foundOrders && foundOrders[0]) {
      res.status(200).send({
        message: "Fetched orders",
        code: 200,
        success: true,
        date: Date.now(),
      });
    } else {
      res.status(204).send({
        message: "No orders",
        code: 204,
        success: true,
        date: Date.now(),
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "This error is coming from getOrders endpoint, please report to the sys administrator !",
      code: 500,
      success: false,
      date: Date.now(),
    });
  }
};

exports.viewOrder = async (req, res) => {
  try {
    const token = req["cookies"]["x-order-token"];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    const foundUser = await UserModel.findOne({
      id: user.id,
    });
    const foundCompany = await CompanyModel.findOne({
      id: foundUser.idCompany,
    });
    if (!foundUser) {
      return res.status(404).send({
        message: "User not found",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    if (!foundCompany || !foundCompany.users.includes(foundUser.id)) {
      return res.status(404).send({
        message: "You don't belong to a company",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    const id = req.params["id"];
    const foundOrder = await OrderModel.findOne({
      id,
      restaurant: foundCompany.id,
    }).select("-__v -_id");
    if (!foundOrder) {
      return res.status(404).send({
        message: "Order not found",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    return res.status(200).send({
      message: "Fetched order",
      code: 200,
      success: true,
      date: Date.now(),
      data: foundOrder,
    });
  } catch (error) {
    res.status(500).send({
      message:
        "This error is coming from viewOrder endpoint, please report to the sys administrator !",
      code: 500,
      success: false,
      date: Date.now(),
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const token = req["cookies"]["x-order-token"];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    const foundUser = await UserModel.findOne({
      id: user.id,
    });
    const foundCompany = await CompanyModel.findOne({
      id: foundUser.idCompany,
    });
    if (!foundUser) {
      return res.status(404).send({
        message: "User not found",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    if (!foundCompany || !foundCompany.users.includes(foundUser.id)) {
      return res.status(404).send({
        message: "You don't belong to a company",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    const id = req.params["id"];
    const foundOrder = await OrderModel.findOne({
      id,
      restaurant: foundCompany.id,
    }).select("-__v -_id");
    if (!foundOrder) {
      return res.status(404).send({
        message: "Order not found",
        code: 404,
        success: false,
        date: Date.now(),
      });
    }
    if (foundOrder.status === "New") {
      return res.status(200).send({
        message: "Fetched order",
        code: 200,
        success: true,
        date: Date.now(),
        data: foundOrder,
      });
    } else if (foundOrder.status === "Ready") {
      return res.status(200).send({
        message: "Fetched order",
        code: 200,
        success: true,
        date: Date.now(),
        data: foundOrder,
      });
    } else {
      return res.status(200).send({
        message: "Fetched order",
        code: 200,
        success: true,
        date: Date.now(),
        data: foundOrder,
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "This error is coming from updateStatus endpoint, please report to the sys administrator !",
      code: 500,
      success: false,
      date: Date.now(),
    });
  }
};
