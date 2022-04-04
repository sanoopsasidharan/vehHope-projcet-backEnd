const express = require("express");
const router = express.Router();
const {
  newConversation,
  getConversation,
} = require("../controller/conversationController");

router.post("/", newConversation);

router.get("/:userId", getConversation);

module.exports = router;
