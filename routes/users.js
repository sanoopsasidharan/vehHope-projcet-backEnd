var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
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

router.get("/", userControll.userHome);

// user profile
// @body userId
// retrun user data
router.post("/userProfile", userControll.gettingUserDetails);

// @ update user details
// @body userId,name,email,password,number
// @ retrun message
router.post("/update_userProfile", userControll.update_userProfile);

router.post("/isLoggedin", verifyAccessToken, (req, res, next) => {
  // const userToken = req.cookies.userTocken;
  // jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
  //   if (err) {
  //     return res.json({ user: false });
  //   } else {
  //     const userId = payload.aud;
  //     res
  //       .cookie("userId", userId, { httpOnly: true })
  //       .json({ user: true, payload });
  //   }
  // });
});

module.exports = router;
