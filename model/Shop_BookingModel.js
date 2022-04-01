const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bookingSchema = new schema({
  userId: {},
  shopId: {},
  servieNote: {},
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createTime: {},
  date: {
    type: Date,
  },
  company: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;
