const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userPasswordSchema = new schema({
  oldPassword: {
    type: String,
    required: true,
  },
  newPassword: {
    type: String,
    required: true,
  },
});

userPasswordSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userPasswordSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const UserPassword = mongoose.model("user", userPasswordSchema);

module.exports = UserPassword;
