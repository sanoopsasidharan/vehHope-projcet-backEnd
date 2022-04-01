const createError = require("http-errors");
const {
  shopLoginSchema,
  shopCreateingSchema,
} = require("../config/valiadation_schema");
const { shopAccessToken } = require("../config/jwt_helper");
const Shops = require("../model/shopModel");
const Booking = require("../model/Shop_BookingModel");
const User = require("../model/userModel");
const { cloudinary } = require("../utils/cloudinary");
var objectId = require("mongodb").ObjectId;

module.exports = {
  shopHome: async (req, res) => {
    console.log("shop home page mvc");
    res.send("shop home page mvc");
  },
  loginShop: async (req, res, next) => {
    try {
      console.log("this is shop");
      console.log(req.body);
      const result = await shopLoginSchema.validateAsync(req.body);
      const shop = await Shops.findOne({ email: result.email });
      console.log(shop, "user");
      if (!shop) throw createError.NotFound("user not registered");
      const isMatch = await shop.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized("username/password not valid");

      const shopAcessToken = await shopAccessToken(shop);
      res
        .cookie("shopTocken", shopAcessToken, { httpOnly: true })
        .json({ shop });
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
    console.log("this is calling create shop");
    console.log(req.body);
    console.log(req.payload);
    try {
      console.log(req.body.image);
      const file = req.body.image;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: "vehHope",
      });
      console.log(uploadResponse);
      console.log(uploadResponse.secure_url);

      // const result = await shopCreateingSchema.validateAsync(req.body);
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
        { set: { isShop: true } }
      );
      res.json(saveShop);
    } catch (error) {
      if (error.isJoi) console.log(error);
      next(error);
    }
  },
  // view shop profile
  view_ShopProfile: async (req, res, next) => {
    console.log(req.payload.aud, "payload");
    try {
      const shopProfile = await Shops.aggregate([
        { $match: { _id: objectId(req.payload.aud) } },
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
      ]);

      console.log(shopProfile[0]);

      if (!shopProfile) throw createError.NotFound("shop not get");
      res.json(shopProfile[0]);
    } catch (error) {
      next(error);
    }
  },
  // view shop booking history
  view_shopBookingHistory: async (req, res, next) => {
    console.log(req.payload.aud, "this is payload shop id");
    try {
      const shopId = req.payload.aud;
      console.log(shopId, "this is shop id");
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
  // find top rating shops
  find_topShop: async (req, res, next) => {
    try {
      // const topshops = await Shops.find().limit(9);
      console.log("finding top shops");
      console.log(req.body);
      const { longitudeState, lantitudeState, kmValue } = req.body;
      const topshops = await Shops.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [+longitudeState, +lantitudeState],
            },
            distanceField: "dist.calculated",
            maxDistance: kmValue * 1000,
            includeLocs: "dist.location",
            spherical: true,
          },
        },
        {
          $match: { active: false },
        },
      ]);
      console.log(topshops);
      res.json(topshops);
    } catch (error) {
      next(error);
    }
  },
  // change booking status
  ChangeBookingStatus: async (req, res, next) => {
    try {
      console.log(req.body.status);
      console.log(req.body.bookingId, "booking id ");
      const changeStatus = await Booking.updateOne(
        { _id: objectId(req.body.bookingId) },
        { $set: { status: req.body.status } }
      );

      console.log(changeStatus);
      if (!changeStatus.acknowledged)
        return next(createError.BadRequest(" somthing error "));
      console.log(changeStatus);
      res.json(changeStatus);
    } catch (error) {
      next(error);
    }
  },
  // update shop details
  update_ShopProfile: async (req, res, next) => {
    try {
      console.log(req.body);
      const { shopName, shopType, email, number, state, description } =
        req.body;
      console.log(req.payload.aud);

      const updateShopDetails = await Shops.findByIdAndUpdate(req.payload.aud, {
        $set: { shopName, shopType, email, number, state, description },
      });
      console.log(updateShopDetails);
      res.json(updateShopDetails);
    } catch (error) {
      next(error);
    }
  },
};
