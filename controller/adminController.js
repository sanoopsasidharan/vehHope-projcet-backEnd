const createError = require("http-errors");
const { adminAccessToken } = require("../config/jwt_helper");
const { adminLogin } = require("../config/valiadation_schema");
var objectId = require("mongodb").ObjectId;
const Admin = require("../model/adminLoginModel");
const Shops = require("../model/shopModel");
const User = require("../model/userModel");
module.exports = {
  admin_Login: async (req, res, next) => {
    console.log(req.body);
    try {
      const result = await adminLogin.validateAsync(req.body);
      console.log(result.email);
      const { email, password } = result;
      const admin = await Admin.findOne({ email, password });
      console.log(admin);
      if (admin === null)
        throw createError.Unauthorized("username/password not valid");

      const adminToken = await adminAccessToken(admin);
      res.cookie("adminToken", adminToken, { httpOnly: true }).json({ admin });
    } catch (error) {
      if (error.isJoi)
        return next(createError.BadRequest("invalid username / password"));
      next(error);
    }
  },
  //   admin can viwe all users
  get_AllUsers: async (req, res, next) => {
    try {
      const users = await User.find().sort({ _id: -1 });
      console.log(users);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
  //   block unblock user
  block_UnblockUser: async (req, res, next) => {
    try {
      console.log("this is update user");
      const { Id, value } = req.body;
      const userRes = await User.findByIdAndUpdate(Id, {
        $set: { isActive: value },
      });

      console.log(userRes);
      res.json(userRes);
    } catch (error) {
      next(error);
    }
  },
  // getingUser
  getingUsers: async (req, res, next) => {
    try {
      console.log(req.query.value, "req.query.value");
      const result = await User.find({ isActive: req.query.value });
      console.log(result);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  //  admin can viwe all shop
  get_Allshops: async (req, res, next) => {
    try {
      const shops = await Shops.find().sort({ _id: -1 });
      console.log(shops);
      res.json(shops);
    } catch (error) {
      next(error);
    }
  },
  //  admin update shop active
  update_ShopActive: async (req, res, next) => {
    try {
      console.log(req.body);
      const { Id, value } = req.body;
      const shopRes = await Shops.findByIdAndUpdate(Id, {
        $set: { active: value },
      });

      res.json(shopRes);
    } catch (error) {
      next(error);
    }
  },

  // getting Shops
  gettingShops: async (req, res, next) => {
    try {
      console.log(req.query.value);
      const shops = await Shops.find({ active: req.query.value }).sort({
        _id: -1,
      });
      console.log(shops);
      res.json(shops);
    } catch (error) {
      next(error);
    }
  },
  // find shop
  findShop: async (req, res, next) => {
    try {
      console.log(req.query.name);
      const shop = await Shops.find({
        shopName: { $regex: req.query.name },
      }).sort({
        _id: -1,
      });

      console.log(shop);
      res.json(shop);
    } catch (error) {
      next(error);
    }
  },
};
