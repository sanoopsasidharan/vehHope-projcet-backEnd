const createError = require("http-errors");
const User = require("../model/userModel");
const Shop = require("../model/shopModel");
const Booking = require("../model/Shop_BookingModel");
var objectId = require("mongodb").ObjectId;
const { cloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  loginSchema,
  userCreateSchema,
  user_DetailsUpdate,
} = require("../config/valiadation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt_helper");
const IdPicker = require("../config/token_helper");
const Shops = require("../model/shopModel");
module.exports = {
  // user Home page
  userHomePage: async (req, res, next) => {
    try {
      console.log("this is your home page ");
      const shops = await Shop.find().limit(9);
      console.log(shops);
      res.json(shops);
    } catch (error) {
      next(error);
    }
  },
};
