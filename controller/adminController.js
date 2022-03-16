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
      const users = await User.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
  //   block unblock user
  block_UnblockUser: async (req, res, next) => {
    try {
      const { userId, block } = req.body;
      const userRes = await User.updateOne(
        { _id: objectId(userId) },
        { $set: { block } }
      );
      console.log(userRes);
      res.json(userRes);
    } catch (error) {
      next(error);
    }
  },
  //  admin can viwe all shop
  get_Allshops: async (req, res, next) => {
    try {
      const shops = await Shops.find();
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
      const { shopId, active } = req.body;
      const shopRes = await Shops.updateOne(
        { _id: objectId(shopId) },
        { $set: { active } }
      );

      if (!shopRes.acknowledged) return res.json({ acknowledged: false });

      res.json(shopRes);
    } catch (error) {}
  },
};
