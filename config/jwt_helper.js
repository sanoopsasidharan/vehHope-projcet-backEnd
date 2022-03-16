const jwt = require("jsonwebtoken");
const createError = require("http-errors");
// const { refreshToken } = require("../controller/userController");

module.exports = {
  signAccessToken: (user) => {
    console.log(user, "funning");
    const id = user._id + "";
    const userNme = user.name;
    console.log(id, userNme);
    return new Promise((resolve, rejcet) => {
      const payload = {
        userNme,
        id,
      };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "vehHope.sanoopsasidharan.tech",
        audience: id,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          rejcet(createError.InternalServerError());
        } else {
          resolve(token);
        }
      });
    });
  },
  // verifyAccessToken: (req, res, next) => {
  //   if (!req.headers["authorization"]) return next(createError.Unauthorized());
  //   const authHeader = req.headers["authorization"];
  //   const bearerToken = authHeader.split(" ");
  //   const token = bearerToken[1];
  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
  //     if (err) {
  //       const message =
  //         err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
  //       return next(createError.Unauthorized(message));
  //     } else {
  //       req.payload = payload;
  //       next();
  //     }
  //   });
  // },
  signRefreshToken: (userId) => {
    return new Promise((resolve, rejcet) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "vehHope.sanoopsasidharan.tech",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          rejcet(createError.InternalServerError());
        } else {
          resolve(token);
        }
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;
          resolve(userId);
        }
      );
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.cookies.userTocken) return res.json({ user: false });
    const userToken = req.cookies.userTocken;
    jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return res.json({ user: false });
      } else {
        req.payload = payload;
        const userId = payload.aud;
        res.json({ user: true, payload });
        // .cookie("userId", userId, { httpOnly: true })

        next();
      }
    });
  },
};
