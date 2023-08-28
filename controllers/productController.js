const { validationResult } = require("express-validator");
const Product = require("../models/Product");
const throwError = require("../utils/ErrorHandle");
const {
  getItemsByPage,
  getTotalPage,
  PAGE_SIZE,
  getPageTotal,
} = require("../utils/paging");

exports.getTrendingProducts = (req, res, next) => {
  Product.find({})
    .limit(8)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProductDetails = (req, res, next) => {
  let loadedProduct;
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        throwError(404, "This product can not be found!");
      }
      loadedProduct = product;
      Product.find({ category: product.category }).then((productBycate) => {
        const relatedProduct = productBycate.filter(
          (product) => product._id.toString() !== req.params.productId
        );
        res
          .status(200)
          .send({ product: loadedProduct, relatedProduct: relatedProduct });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAllProducts = (req, res, next) => {
  const filterName = req.body.productName || "";
  const filterCategory = req.body.category || "";
  const pageParam = req.query.page || 1;
  Product.find({
    name: { $regex: new RegExp(filterName, "i") },
    category: { $regex: new RegExp(filterCategory, "i") },
  })
    .then((result) => {
      const response = {
        results: getItemsByPage(result, pageParam),
        page: pageParam,
        total_pages: getTotalPage(result),
      };
      res.status(200).send(response);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addNewProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  if (!req.files) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const files = req.files;
  const img1 = files[0].path;
  const img2 = files[1].path;
  const img3 = files[2].path;
  const img4 = files[3].path;
  const name = req.body.name;
  const category = req.body.category;
  const long_desc = req.body.long_desc;
  const short_desc = req.body.short_desc;
  const price = Number(req.body.price);
  const inventoryQuantity = Number(req.body.inventoryQuantity);
  const product = new Product({
    name,
    category,
    long_desc,
    short_desc,
    price,
    img1,
    img2,
    img3,
    img4,
    inventoryQuantity,
  });
  product
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndRemove(productId)
    .then((result) => {
      res.status(200).send({ status: "success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        throwError(404, "Product can not be found");
      }
      product.name = req.body.name;
      product.category = req.body.category;
      product.long_desc = req.body.long_desc;
      product.short_desc = req.body.short_desc;
      product.price = Number(req.body.price);
      return product.save();
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
