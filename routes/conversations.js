const express = require("express");
const router = express.Router();
const {
  newConversation,
  getConversation,
} = require("../controller/conversationController");
const { verifyAccessToken } = require("../config/jwt_helper");

router.post("/", verifyAccessToken, newConversation);

router.get("/:userId", getConversation);

module.exports = router;
