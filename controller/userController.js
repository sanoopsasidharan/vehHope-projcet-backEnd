const createError = require("http-errors");
const User = require("../model/userModel");
const Shop = require("../model/shopModel");
const Booking = require("../model/Shop_BookingModel");
var objectId = require("mongodb").ObjectId;
const { cloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

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
  sampleuserRegister: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(`${email} is already registered`);

      const user = new User(result);
      const saveUser = await user.save();
      const accessToken = await signAccessToken(saveUser._id + "");
      const refreshToken = await signRefreshToken(saveUser._id + "");
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  },
  userLogin: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      console.log(user);
      if (!user) throw createError.NotFound("user not registered");
      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized("username/password not valid");

      const userId = user._id + "";
      const accessToken = await signAccessToken(user);

      res
        .cookie("userTocken", accessToken, { httpOnly: true })
        .json({ user, loggedIn: true });
    } catch (error) {
      if (error.isJoi)
        return next(createError.BadRequest("invalid username / password"));
      next(error);
    }
  },
  ReFreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },
  // register user
  registerUser: async (req, res, next) => {
    try {
      req.body.isShop = false;
      const result = await userCreateSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        return res
          .status(404)
          .json({ msg: `${result.email} is already registered` });
      const user = new User(result);

      const saveUser = await user.save();
      res.json(saveUser);
    } catch (error) {
      if (error.isJoi) return next(createError.BadRequest("data is not valid"));
      next(error);
    }
  },
  // user can create shop
  createShop: async (req, res, next) => {
    try {
      console.log(req.payload, "payload");
      // console.log(req.body.image);
      const file = req.body.image;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: "vehHope",
      });
      console.log(uploadResponse.secure_url);

      const Id = req.payload.aud;
      const shopDetails = {
        shopName: req.body.shopName,
        shopType: req.body.shopType,
        email: req.body.email,
        number: req.body.number,
        location: req.body.location,
        state: req.body.state,
        password: req.body.password,
        userId: req.cookies.userId,
        active: false,
        description: req.body.description,
        image: uploadResponse.secure_url,
        userId: objectId(Id),
      };
      console.log(req.cookies.userId);
      const doesExist = await Shops.findOne({ email: req.body.email });
      console.log(doesExist, "doesExist");
      if (doesExist)
        return res
          .status(404)
          .json({ msg: `${result.email} is already registered` });

      const shop = new Shops(shopDetails);
      const saveShop = await shop.save();
      const user = await User.updateOne(
        { _id: objectId(req.payload.aud) },
        { $set: { isShop: true } }
      );

      console.log(user, "user");
      res.json(saveShop);
    } catch (error) {
      if (error.isJoi) console.log(error);
      next(error);
    }
  },
  // userHome
  userHome: async (req, res) => {
    console.log(req.body);
    console.log("userhaoime");
    res.json({ message: " you " });
  },
  // userDetails
  gettingUserDetails: async (req, res, next) => {
    try {
      // console.log("111111111111");
      // const userId = await IdPicker(req.cookies.userTocken);
      // console.log("22222222222");
      // console.log(userId, "userId");
      let userDD;
      await jwt.verify(
        req.cookies.userTocken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, payload) => {
          if (err) res.json({ user: false });
          else userDD = payload.aud;
        }
      );

      if (!userDD) res.json({ user: false });

      const user = await User.findById(userDD);
      console.log(user, "userdetails");
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
  // update user profile
  update_userProfile: async (req, res, next) => {
    try {
      const { name, email, number, userId } = req.body;
      const result = await user_DetailsUpdate.validateAsync(req.body);
      const userRes = await User.findByIdAndUpdate(userId, {
        $set: { name, email, number },
      });
      res.status(200).json({ message: "update user" });
    } catch (error) {
      next(error);
    }
  },
  // view signle shop
  view_Shop: async (req, res, next) => {
    try {
      console.log(req.body);
      const shop = await Shop.findById(req.body.shopId);
      console.log(result);
      res.json(shop);
    } catch (error) {
      next(error);
    }
  },
  // user booking service
  booking_Service: async (req, res, next) => {
    try {
      console.log(req.body);
      req.body.createTime = new Date();
      req.body.userId = objectId(req.body.userId);
      req.body.shopId = objectId(req.body.shopId);
      req.body.status = "pending";
      console.log(req.body, "req.body");
      const user = new Booking(req.body);
      const saveUser = await user.save();
      res.json(saveUser);
    } catch (error) {
      next(error);
    }
  },
  // user booking history
  user_BookingHistory: async (req, res, next) => {
    try {
      // if (!req.payload.aud) res.json({ err: "user not valid " });
      const userId = req.payload.aud;
      const history = await Booking.aggregate([
        { $match: { userId: objectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "shops",
            localField: "shopId",
            foreignField: "_id",
            as: "shop",
          },
        },
        {
          $unwind: "$shop",
        },
      ]);
      console.log(history);
      // console.log(history[0].user);
      // res.json(history);
      res.json(history).status(200);
    } catch (error) {
      next(error);
    }
  },
  // user  cancel booking
  cancel_BookingHistory: async (req, res, next) => {
    try {
      console.log(req.body);
      const cancel = await Booking.updateOne(
        { _id: objectId(req.body.bookingId) },
        { $set: { status: "cancel" } }
      );
      if (!cancel.acknowledged)
        return next(createError.BadRequest(" somthing error "));
      const history = await Booking.findById(req.body.bookingId);
      console.log(history);
      console.log(cancel);
      res.json(history);
    } catch (error) {
      next(error);
    }
  },
};
