const mongoose = require("mongoose");
const schema = mongoose.Schema;
const feedbackSchema = new schema({
  rateing: {
    type: Number,
    required: true,
  },
  feedBack: {
    type: String,
    required: true,
  },
  shopId: {},
  userId: {},
});

const feedback = mongoose.model("feedback", feedbackSchema);
module.exports = feedback;
