var express = require("express");
var router = express.Router();
const userControll = require("../controller/userController");
const { verifyAccessToken } = require("../config/jwt_helper");

router.get("/", verifyAccessToken, (req, res) => {
  console.log(req.headers["authorization"]);
  res.json({ message: "home page" });
});

router.post("/reFreshToken", userControll.ReFreshToken);

router.post("/sample-register", userControll.sampleuserRegister);

router.post("/user_register", userControll.registerUser);

router.post("/login", userControll.userLogin);

module.exports = router;
