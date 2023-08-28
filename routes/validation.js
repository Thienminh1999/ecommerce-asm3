const { body } = require("express-validator");
const User = require("../models/User");

exports.signUpValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value) => {
      return await User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email address already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 1 }),
  body("fullName").trim().not().isEmpty(),
  body("phone").trim().not().isEmpty(),
  body("role").trim().not().isEmpty(),
];

exports.loginValidation = [
  body("email").trim().not().isEmpty(),
  body("password").trim().not().isEmpty(),
];

exports.addToCartValidation = [
  body("quantity").not().isEmpty().isInt({ min: 1 }),
  body("productId").not().isEmpty().isMongoId(),
];

exports.orderValidation = [
  body("fullName").trim().not().isEmpty(),
  body("phone").trim().not().isEmpty(),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("address").trim().not().isEmpty(),
];

exports.productFormValidation = [
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("category").trim().not().isEmpty().withMessage("Category is required"),
  body("long_desc")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Long description is required"),
  body("short_desc")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Short description is required"),
  body("price")
    .not()
    .isEmpty()
    .isInt({ min: 1 })
    .withMessage("Price must be positive number"),
  body("inventoryQuantity")
    .isInt({ min: 1 })
    .withMessage("Inventory quantity must be positive number"),
  body("files")
    .custom((value, { req }) => {
      if (req.body.files && req.body.files.length !== 4) {
        return false;
      }
      return true;
    })
    .withMessage("Need 4 images for a product"),
];
