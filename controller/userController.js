const createError = require("http-errors");
const User = require("../model/userModel");
const Shop = require("../model/shopModel");
const Booking = require("../model/Shop_BookingModel");
const Feedback = require("../model/FeedbackModel");
var objectId = require("mongodb").ObjectId;
const { cloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const serviceID = process.env.serviceID;
const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const client = require("twilio")(accountSID, authToken);

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
      console.log("this is user login ");
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
        // .cookie("userTocken", accessToken, { httpOnly: true })
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
      console.log("this is register user");
      req.body.isShop = false;
      req.body.isActive = true;
      req.body.image = "fales";

      console.log(req.body);
      console.log("starting validation");
      const result = await userCreateSchema.validateAsync(req.body);
      console.log("fist step");
      const doesExist = await User.findOne({ email: result.email });
      console.log(doesExist);
      if (doesExist)
        return res
          .status(404)
          .json({ msg: `${result.email} is already registered` });
      const user = new User(result);
      const saveUser = await user.save();
      res.json(saveUser);
    } catch (error) {
      console.log(error);
      if (error.isJoi) return next(createError.BadRequest("data is not valid"));
      next(error);
    }
  },
  // user can create shop
  createShop: async (req, res, next) => {
    console.log(req.body);
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
        lantitude: req.body.lantitude,
        longitude: req.body.longitude,
        ShopService: req.body.ShopService,
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
      console.log(req.payload.aud);
      const { name, email, number } = req.body;
      const result = await user_DetailsUpdate.validateAsync(req.body);
      const userRes = await User.findByIdAndUpdate(req.payload.aud, {
        $set: { name, email, number },
      });
      console.log(userRes);
      res.status(200).json({ message: "update user" });
    } catch (error) {
      next(error);
    }
  },
  // view signle shop
  view_Shop: async (req, res, next) => {
    console.log("this is veiw page");
    try {
      console.log("dfafdjkl");
      console.log(req.body);
      const shop = await Shop.findById(req.body.shopId);
      if (!shop) throw createError.NotFound("shop not get");
      console.log(shop);
      res.json(shop);
    } catch (error) {
      next(error);
    }
  },
  // user booking service
  booking_Service: async (req, res, next) => {
    try {
      console.log(".......................");
      console.log(req.body);
      console.log(req.payload.aud);
      req.body.createTime = new Date();
      req.body.userId = objectId(req.payload.aud);
      req.body.shopId = objectId(req.body.shopId);
      req.body.servieNote = "not complete";
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
        {
          $sort: { _id: -1 },
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
  // user booking history in status
  userHistory_InStatus: async (req, res, next) => {
    try {
      if (!req.payload.aud) res.json({ err: "user not valid " });
      const userId = req.payload.aud;
      const history = await Booking.aggregate([
        { $match: { userId: objectId(userId), status: req.body.status } },
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
        {
          $sort: { _id: -1 },
        },
      ]);
      console.log(history);
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
  // edit User Password
  edit_userPassword: async (req, res, next) => {
    try {
      console.log(req.payload.aud);
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({ _id: req.payload.aud });
      console.log(user);
      console.log(oldPassword);
      const isMatch = await user.isValidPassword(oldPassword);
      console.log(isMatch);
      if (!isMatch)
        throw createError.Unauthorized("username/password not valid");

      console.log("did't hash password");
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(newPassword, salt);
      // newPassword = hashedPassword;
      console.log(newPassword);
      const result = await User.findByIdAndUpdate(req.payload.aud, {
        $set: { password: newPassword },
      });
      console.log(result);
      res.status(200).json({ message: "update user" });
    } catch (error) {
      next(error);
    }
  },

  // upload user profile pic
  userPropic: async (req, res, next) => {
    try {
      console.log(req.payload.aud, "payload");
      const file = req.body.image;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: "vehHope",
      });
      if (!uploadResponse) res.json({ message: "sorry no upload pro pic" });

      console.log("............");
      console.log(uploadResponse.secure_url);
      let imageURL = uploadResponse.secure_url.toString();
      console.log(imageURL);
      const result = await User.findByIdAndUpdate(req.payload.aud, {
        $set: { image: imageURL },
      });
      console.log(result);
      res.json({ message: "upload user pro pic" });
    } catch (error) {
      next(error);
    }
  },
  // user loggedOut
  userLoggedOut: async (req, res, next) => {
    try {
      console.log("this is user logged out");
      res
        .cookie("userTocken", "", {
          httpOnly: true,
          expires: new Date(0),
        })
        .json({ logout: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  // otp login
  otpLogin: async (req, res, next) => {
    try {
      console.log(req.body);
      const result = await User.findOne({ number: req.body.number });
      console.log(result);
      if (!result)
        return res.json({ message: "Number not valid", user: false });
      if (!result.isActive)
        return res.json({ message: "User is blocked ", user: false });

      client.verify
        .services(serviceID)
        .verifications.create({ to: `+91${result.number}`, channel: "sms" })
        .then((verification) => console.log(verification.status));

      res.json({ message: " number is  valid", user: true });
    } catch (error) {
      console.log(error);
    }
  },
  // conform otp
  conformOtp: async (req, res, next) => {
    try {
      console.log("this is otp");
      const { number, otp } = req.body;
      client.verify
        .services(serviceID)
        .verificationChecks.create({ to: `+91${number}`, code: otp })
        .then(async (verification_check) => {
          if (verification_check.status === "approved") {
            const user = await User.findOne({ number });
            const accessToken = await signAccessToken(user);

            res
              .cookie("userTocken", accessToken, { httpOnly: true })
              .json({ user, loggedIn: true, message: "user loggedin" });
          } else {
            res.json({ message: "otp not match", loggedIn: false });
          }
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  // finding Shop rateing
  GettingShopRateing: async (req, res, next) => {
    try {
      console.log(req.body, "this is shop id ");
      const { shopId } = req.body;
      console.log(shopId, "this is shop Id req.body.shopId");

      const rating = await Feedback.find({ shopId: objectId(shopId) });
      const getRating = await Feedback.aggregate([
        {
          $match: { shopId: objectId(shopId) },
        },
        {
          $group: { _id: "$shopId", avarge: { $avg: "$rateing" } },
        },
        {
          $project: { _id: 0, avarge: 1 },
        },
      ]);
      console.log(getRating, "objectId(req.payload.aud)");
      console.log(rating);
      res.status(200).json(getRating[0]).end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
