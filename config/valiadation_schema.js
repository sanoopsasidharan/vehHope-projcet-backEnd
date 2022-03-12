const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(4).required(),
});

module.exports = {
  loginSchema,
};
