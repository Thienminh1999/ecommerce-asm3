const Order = require("../models/Order");
const User = require("../models/User");

exports.getInfoBoard = async (req, res, next) => {
  try {
    const userAmount = await User.find({}).countDocuments();
    const sumOfOrder = await Order.find({}).countDocuments();
    const sumOfRevenue = await Order.aggregate([
      { $group: { _id: null, price: { $sum: "$price" } } },
    ]);
    const recentOrders = await Order.find({}).limit(10);
    res.status(200).send({
      userAmount,
      sumOfOrder,
      sumOfRevenue: sumOfRevenue[0].price,
      recentOrders,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
