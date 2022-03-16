const mongoose = require("mongoose");
const schema = mongoose.Schema;
const adminSchema = new schema({
  eamil: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
