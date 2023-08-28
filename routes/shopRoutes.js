const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const isAuth = require("../middleware/is-auth");
const { addToCartValidation, orderValidation } = require("./validation");

router.post(
  "/add-to-cart",
  addToCartValidation,
  isAuth,
  shopController.addToCart
);
router.post("/orders", orderValidation, isAuth, shopController.order);
router.get("/orders/:orderId", isAuth, shopController.getOrderDetail);
router.get("/user/orders", isAuth, shopController.getOrderOfUser);
router.get("/user/cart", isAuth, shopController.getCartItem);
router.post(
  "/user/change-item-quantity",
  isAuth,
  shopController.setQuantityItemInCart
);
router.post("/user/cart/remove", isAuth, shopController.removeItemFromCart);

module.exports = router;
