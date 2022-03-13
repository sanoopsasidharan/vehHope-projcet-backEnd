const createError = require("http-errors");
const User = require("../model/userModel");
const {
  loginSchema,
  userCreateSchema,
} = require("../config/valiadation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt_helper");
module.exports = {
  sampleuserRegister: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(`${email} is already registered`);

      const user = new User(result);
      const saveUser = await user.save();
      const accessToken = await signAccessToken(saveUser._id + "");
      const refreshToken = await signRefreshToken(saveUser._id + "");
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  },
  userLogin: async (req, res, next) => {
    try {
      console.log(req.body);
      const result = await loginSchema.validateAsync(req.body);
      console.log("00000000000");
      const user = await User.findOne({ email: result.email });
      console.log(user);
      if (!user) throw createError.NotFound("user not registered");
      console.log("............");
      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized("username/password not valid");
      console.log("............////////");

      const accessToken = await signAccessToken(user._id + "");
      // const refreshToken = await signRefreshToken(user._id + "");

      // res.send({ accessToken, refreshToken });
      res.cookie("userTocken", accessToken, { httpOnly: true }).send();
    } catch (error) {
      if (error.isJoi)
        return next(createError.BadRequest("invalid username / password"));
      next(error);
    }
  },
  ReFreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },
  // register user
  registerUser: async (req, res, next) => {
    try {
      const result = await userCreateSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        return res
          .status(404)
          .json({ msg: `${result.email} is already registered` });
      const user = new User(result);
      const saveUser = await user.save();
      res.json(saveUser);
    } catch (error) {
      if (error.isJoi) return next(createError.BadRequest("data is not valid"));
      next(error);
    }
  },
};
