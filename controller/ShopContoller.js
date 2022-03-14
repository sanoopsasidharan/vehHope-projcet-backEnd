const createError = require("http-errors");
const { shopLoginSchema } = require("../config/valiadation_schema");
const shops = require("../model/shopModel");
module.exports = {
  shopHome: async (req, res) => {
    console.log("shop home page mvc");
    res.send("shop home page mvc");
  },
  loginShop: async (req, res, next) => {
    try {
      const result = await shopLoginSchema.validateAsync(req.body);
      console.log(result);
      const user = await shops.findOne({ email: result.email });
      console.log(user, "user");
    } catch (error) {
      next(error);
    }
  },
  // userLogin: async (req, res, next) => {
  //   try {
  //     const result = await shopLoginSchema.validateAsync(req.body);
  //     const user = await User.findOne({ email: result.email });
  //     console.log(user);
  //     if (!user) throw createError.NotFound("user not registered");
  //     const isMatch = await user.isValidPassword(result.password);
  //     if (!isMatch)
  //       throw createError.Unauthorized("username/password not valid");
  //     const accessToken = await signAccessToken(user._id + "");

  //     res.cookie("userTocken", accessToken, { httpOnly: true }).send();
  //   } catch (error) {
  //     if (error.isJoi)
  //       return next(createError.BadRequest("invalid username / password"));
  //     next(error);
  //   }
  // },
};
