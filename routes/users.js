var express = require("express");
var router = express.Router();
const userControll = require("../controller/userController");
const { verifyAccessToken } = require("../config/jwt_helper");
const { userAuth } = require("../middleware/userAuth");

// router.get("/", verifyAccessToken, (req, res) => {
//   console.log(req.headers["authorization"]);
//   res.json({ message: "home page" });
// });

router.post("/reFreshToken", userControll.ReFreshToken);

router.post("/sample-register", userControll.sampleuserRegister);

router.post("/user_register", userControll.registerUser);

router.post("/login", userControll.userLogin);

router.get("/", userAuth, userControll.userHome);

router.post("/isLoggedin", verifyAccessToken, (req, res, next) => {
  console.log(req.cookies.userTocken);
  console.log("is loggedin");
  res.json({ user: true });
});

module.exports = router;
