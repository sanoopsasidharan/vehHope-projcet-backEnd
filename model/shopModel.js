const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { object, array } = require("joi");
const shopSchema = new schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
  },
  shopType: {
    type: String,
  },
  number: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  state: {
    type: String,
  },
  userId: {},
  image: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  lantitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  ShopService: {
    type: Array,
  },
});
shopSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
shopSchema.pre(
  "save",
  async function (next) {
    this.location = {
      type: "Point",
      coordinates: [this.longitude, this.lantitude],
    };
    next();
  },
  { timestamps: true }
);

shopSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const Shops = mongoose.model("shops", shopSchema);

module.exports = Shops;
