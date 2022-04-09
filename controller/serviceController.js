const createError = require("http-errors");
const User = require("../model/userModel");
const Shop = require("../model/shopModel");
const Booking = require("../model/Shop_BookingModel");
var objectId = require("mongodb").ObjectId;
const { cloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Feedback = require("../model/FeedbackModel");
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
  // add serice note after service
  addServiceNote: async (req, res, next) => {
    try {
      const { nextServiceKm, workerName, serviceDiscription, id } = req.body;
      const serviceNote = {
        nextServiceKm,
        workerName,
        serviceDiscription,
      };
      console.log(req.payload);
      console.log(req.body);
      const addServiceNote = await Booking.findByIdAndUpdate(id, {
        $set: { servieNote: serviceNote },
      });
      console.log(addServiceNote);
      res.json(addServiceNote);
    } catch (error) {
      next(error);
    }
  },
  // add feedback
  addFeedback: async (req, res, next) => {
    try {
      if (req.body.feedBack === "")
        throw createError.BadRequest("feedback is null");
      console.log(req.payload.aud);
      req.body.userId = objectId(req.payload.aud);
      req.body.shopId = objectId(req.body.shopId);
      console.log(req.body);
      const feedBackRes = await Feedback.findOne({
        userId: req.body.userId,
        shopId: req.body.shopId,
      });
      if (feedBackRes) {
        const updateFeedbake = await Feedback.findByIdAndUpdate(
          feedBackRes._id,
          { $set: { rateing: req.body.rateing, feedBack: req.body.feedBack } }
        );
        console.log(updateFeedbake);
      } else {
        const feed = new Feedback(req.body);
        const saveFeed = await feed.save();
        console.log(saveFeed, "savefeed");
      }
      console.log(feedBackRes, "req.body.shopId");
      res.json(feedBackRes);
    } catch (error) {
      next(error);
    }
  },
};
