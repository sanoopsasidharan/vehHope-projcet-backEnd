const createError = require("http-errors");
const User = require("../model/userModel");
const { loginSchema } = require("../config/valiadation_schema");
const { signAccessToken } = require("../config/jwt_helper");
module.exports = {
  userLogin: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(`${email} is already registered`);

      const user = new User(result);
      const saveUser = await user.save();
      const accessToken = await signAccessToken(saveUser._id + "");
      res.send({ accessToken });
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  },
};
