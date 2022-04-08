const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(4).required(),
});

const userCreateSchema = joi.object({
  name: joi.string().lowercase().min(3).required(),
  email: joi.string().email().lowercase().required(),
  number: joi.string().required(),
  place: joi.string().required(),
  password: joi.string().min(4).required(),
  isShop: joi.boolean().required(),
  isActive: joi.boolean().required(),
  lantitude: joi.string().required(),
  longitude: joi.string().required(),
  image: joi.string(),
});
const shopLoginSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(4).required(),
});

const shopCreateingSchema = joi.object({
  shopName: joi.string().lowercase().min(3).required(),
  shopType: joi.string().lowercase().min(3).required(),
  email: joi.string().email().lowercase().required(),
  number: joi.string().length(10).required(),
  location: joi.string().required(),
  state: joi.string().required(),
  // imgae: joi.string(),
});

const user_DetailsUpdate = joi.object({
  email: joi.string().lowercase().email().required(),
  number: joi.string().required(),
  name: joi.string().lowercase().required(),
});

const adminLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = {
  loginSchema,
  userCreateSchema,
  shopLoginSchema,
  shopCreateingSchema,
  user_DetailsUpdate,
  adminLogin,
};
