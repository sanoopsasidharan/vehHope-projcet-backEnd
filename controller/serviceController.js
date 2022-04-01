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
};
