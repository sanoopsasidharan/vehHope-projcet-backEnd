const createError = require("http-errors");
const Booking = require("../model/Shop_BookingModel");
var objectId = require("mongodb").ObjectId;
const User = require("../model/userModel");
const Shop = require("../model/shopModel");
const Conversation = require("../model/conversation");

module.exports = {
  // new conversation
  newConversation: async (req, res, next) => {
    console.log("this is conversation router");
    try {
      const IfConversation = await Conversation.find({
        members: { $in: [req.body.receiverId] },
      });
      console.log(IfConversation.length > 0, "IfConversation");

      if (IfConversation.length > 0) {
        res.json(IfConversation);
      } else {
        const newConversation = new Conversation({
          members: [req.payload.aud, req.body.receiverId],
        });
        const savedConversation = await newConversation.save();
        console.log(savedConversation);
        res.json(savedConversation);
      }
    } catch (error) {
      next(error);
    }
  },
  // get all conversations
  getConversation: async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      }).sort({ _id: -1 });
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  },
  findCurrentFrd: async (req, res, next) => {
    try {
      console.log(req.query.frdId);
      const findFrd = await User.findById(req.query.frdId);
      console.log(findFrd);
      if (!findFrd) throw createError.BadRequest("data not get");
      res.json(findFrd);
    } catch (error) {
      next(error);
    }
  },
  // find current shop
  findCurrentshop: async (req, res, next) => {
    try {
      console.log(req.query.shopId);
      const findShop = await Shop.findById(req.query.shopId);
      console.log(findShop);
      if (!findShop) throw createError.BadRequest("data not get");
      res.json(findShop);
    } catch (error) {
      next(error);
    }
  },
};
