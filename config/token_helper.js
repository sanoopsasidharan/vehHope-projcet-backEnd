const jwt = require("jsonwebtoken");
const IdPicker = async (token) => {
  const id = null;
  let data;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.log("error return");
      return id;
    } else {
      console.log("return payload", payload);
      const userId = payload.aud;
      console.log(userId, "useridid");
      data = "sanoop";
      return data;
    }
  });
};

module.exports = IdPicker;
