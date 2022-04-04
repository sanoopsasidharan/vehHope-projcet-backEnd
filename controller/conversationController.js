const createError = require("http-errors");
const Booking = require("../model/Shop_BookingModel");
var objectId = require("mongodb").ObjectId;
const Conversation = require("../model/conversation");

module.exports = {
  // new conversation
  newConversation: async (req, res, next) => {
    console.log("this is conversation router");
    try {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
      const savedConversation = await newConversation.save();
      res.json(savedConversation);
    } catch (error) {
      next(error);
    }
  },
  // get all conversations
  getConversation: async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  },
};
