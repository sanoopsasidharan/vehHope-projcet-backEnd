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

// user home page
// @no body
// @noretrun
router.get("/", userControll.userHome);

// user profile
// @body userId
// @retrun user data
router.post("/userProfile", userControll.gettingUserDetails);

// @ update user details
// @body userId,name,email,password,number
// @ retrun message
router.post("/update_userProfile", userControll.update_userProfile);

// @view single shop
// @body shopId
// return shop objcet
router.post("/view_Shop", userControll.view_Shop);

// user booking page
// @body shopId
// return saveUser object
router.post("/service_Booking", userControll.booking_Service);

// show all booking history of user
// @body userId
// return
router.post("/user_Booking_History", userControll.user_BookingHistory);

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
