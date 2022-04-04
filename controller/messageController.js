const createError = require("http-errors");
var objectId = require("mongodb").ObjectId;
const Message = require("../model/messageModal");

module.exports = {
  newMessage: async (req, res, next) => {
    try {
      const NewMessage = new Message(req.body);
      const savedMessage = await NewMessage.save();
      res.status(200).json(savedMessage);
    } catch (error) {
      next(error);
    }
  },
  //   get all messages
  getMessages: async (req, res, next) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },
};
