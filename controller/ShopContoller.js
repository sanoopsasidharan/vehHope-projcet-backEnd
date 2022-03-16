const createError = require("http-errors");
const {
  shopLoginSchema,
  shopCreateingSchema,
} = require("../config/valiadation_schema");
const Shops = require("../model/shopModel");
const Booking = require("../model/Shop_BookingModel");
const { cloudinary } = require("../utils/cloudinary");
var objectId = require("mongodb").ObjectId;

module.exports = {
  shopHome: async (req, res) => {
    console.log("shop home page mvc");
    res.send("shop home page mvc");
  },
  loginShop: async (req, res, next) => {
    try {
      const result = await shopLoginSchema.validateAsync(req.body);
      console.log(result);
      const user = await Shops.findOne({ email: result.email });
      console.log(user, "user");
    } catch (error) {
      next(error);
    }
  },
  // userLogin: async (req, res, next) => {
  //   try {
  //     const result = await shopLoginSchema.validateAsync(req.body);
  //     const user = await User.findOne({ email: result.email });
  //     console.log(user);
  //     if (!user) throw createError.NotFound("user not registered");
  //     const isMatch = await user.isValidPassword(result.password);
  //     if (!isMatch)
  //       throw createError.Unauthorized("username/password not valid");
  //     const accessToken = await signAccessToken(user._id + "");

  //     res.cookie("userTocken", accessToken, { httpOnly: true }).send();
  //   } catch (error) {
  //     if (error.isJoi)
  //       return next(createError.BadRequest("invalid username / password"));
  //     next(error);
  //   }
  // },

  // createing shop
  CreateShop: async (req, res, next) => {
    console.log(req.body);
    try {
      console.log(req.body.image);
      const file = req.body.image;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: "vehHope",
      });
      console.log(uploadResponse);
      console.log(uploadResponse.secure_url);

      // const result = await shopCreateingSchema.validateAsync(req.body);

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
        image: uploadResponse.secure_url,
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
      res.json(saveShop);
    } catch (error) {
      if (error.isJoi) console.log(error);
      next(error);
    }
  },
  // view shop profile
  view_ShopProfile: async (req, res, next) => {
    console.log(req.body);
    try {
      const shopProfile = await Shops.findById(req.body.shopId);
      console.log(shopProfile);
      res.json(shopProfile);
    } catch (error) {
      next(error);
    }
  },
  // view shop booking history
  view_shopBookingHistory: async (req, res, next) => {
    console.log(req.body);
    try {
      const { shopId } = req.body;
      const history = await Booking.aggregate([
        { $match: { shopId: objectId(shopId) } },
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
      res.json(history);
    } catch (error) {
      next(error);
    }
  },
};
