var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const {
  ReFreshToken,
  user_BookingHistory,
  sampleuserRegister,
  registerUser,
  userLogin,
  userHome,
  gettingUserDetails,
  update_userProfile,
  view_Shop,
  booking_Service,
  cancel_BookingHistory,
  createShop,
} = require("../controller/userController");
const { verifyAccessToken } = require("../config/jwt_helper");

router.post("/reFreshToken", ReFreshToken);

router.post("/sample-register", sampleuserRegister);

router.post("/user_register", registerUser);

router.post("/login", userLogin);

// create shop
// body
// return
router.post("/create_shop", verifyAccessToken, createShop);

// user home page
// @no body
// @noretrun
router.get("/", userHome);

// user profile
// @body userId
// @retrun user data
router.post("/userProfile", gettingUserDetails);

// @ update user details
// @body userId,name,email,password,number
// @ retrun message
router.post("/update_userProfile", update_userProfile);

// @view single shop
// @body shopId
// return shop objcet
router.post("/view_Shop", view_Shop);

// user booking page
// @body shopId
// return saveUser object
router.post("/service_Booking", booking_Service);

// show all booking history of user
// @body userId
// return
router.post("/user_Booking_History", verifyAccessToken, user_BookingHistory);

// update user booking history
// @body bookingId
// return
router.post("/CancelBooking", verifyAccessToken, cancel_BookingHistory);

router.post("/isLoggedin", verifyAccessToken, (req, res, next) => {
  let payload = req.payload;
  res.json({ user: true, payload });
});

module.exports = router;
