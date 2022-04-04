const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ConversationSchema = new schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
