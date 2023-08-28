const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAuth = require("../middleware/is-auth");
const { productFormValidation } = require("./validation");

router.get("/trending", productController.getTrendingProducts);
router.post("/all", productController.getAllProducts);

router.post(
  "/create",
  productFormValidation,
  isAuth,
  productController.addNewProduct
);
router.get("/:productId", productController.getProductDetails);

router.post(
  "/update",
  productFormValidation,
  isAuth,
  productController.updateProduct
);
router.delete("/:productId", isAuth, productController.deleteProduct);

module.exports = router;
