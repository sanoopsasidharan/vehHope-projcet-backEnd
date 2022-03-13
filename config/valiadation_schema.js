const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(4).required(),
});

const userCreateSchema = joi.object({
  name: joi.string().lowercase().min(3).required(),
  email: joi.string().email().lowercase().required(),
  number: joi.string().min(10).max(10).required(),
  location: joi.string().required(),
  password: joi.string().min(4).required(),
});
module.exports = {
  loginSchema,
  userCreateSchema,
};
