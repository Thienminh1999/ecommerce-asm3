const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

router.get("/info-board", isAuth, adminController.getInfoBoard);

module.exports = router;
