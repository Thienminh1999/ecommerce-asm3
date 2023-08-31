const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const throwError = require("../utils/ErrorHandle");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const userData = {
        email: req.body.email,
        password: hashedPassword,
        fullName: req.body.fullName,
        phone: req.body.phone,
        role: req.body.role,
        cart: { items: [] },
      };
      const user = new User(userData);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User Created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role || "CUSTOMER";
  let loadedUser;
  User.findOne({ email: email })
    .populate("cart.items.productId", "img1 name price")
    .then((user) => {
      if (!user) {
        throwError(401, "User with this email could not be found!");
      }
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      loadedUser = { ...user._doc, cart: { items: products } };
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        throwError(401, "Wrong password!");
      }
      if (!loadedUser.role.includes(role)) {
        throwError(401, "User do not have this role");
      }
      req.session.isLoggedIn = true;
      req.session.user = loadedUser;
      return req.session.save((err) => {
        res.status(200).json({
          user: loadedUser,
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id }, "email fullName phone role")
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.status(200).send({ status: "success" });
  });
};
