const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/is-auth");

const { signUpValidation, loginValidation } = require("./validation");

router.post("/signup", signUpValidation, authController.signup);
router.post("/login", loginValidation, authController.login);
router.post("/logout", isAuth, authController.logout);
router.get("/user", isAuth, authController.getCurrentUser);

module.exports = router;
