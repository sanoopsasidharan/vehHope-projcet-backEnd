const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const userAuth = async (req, res, next) => {
  console.log("middileware");
  console.log(req.cookies.userTocken);
  if (!req.cookies.userTocken) return next(createError.Unauthorized());

  const userToken = req.cookies.userTocken;
  jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    } else {
      req.payload = payload;
      console.log(payload);
      next();
    }
  });
  // next();
};

module.exports = {
  userAuth,
};
