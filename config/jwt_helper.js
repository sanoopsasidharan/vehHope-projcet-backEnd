const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, rejcet) => {
      const payload = {};
      const secret = "sumthing super";
      const options = {
        expiresIn: "1h",
        issuer: "vehHope.sanoopsasidharan.tech",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) rejcet(err);
        resolve(token);
      });
    });
  },
};
