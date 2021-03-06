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
  userHistory_InStatus,
  edit_userPassword,
  userPropic,
  userLoggedOut,
  otpLogin,
  conformOtp,
  GettingShopRateing,
} = require("../controller/userController");
const { userHomePage } = require("../controller/userHomeController");
const { verifyAccessToken } = require("../config/jwt_helper");
const { addFeedback } = require("../controller/serviceController");
const User = require("../model/userModel");
const Shops = require("../model/shopModel");
const { findCurrentshop } = require("../controller/conversationController");

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
router.post("/update_userProfile", verifyAccessToken, update_userProfile);

// @view single shop
// @body shopId
// return shop objcet
router.post("/view_Shop", view_Shop);

// user booking page
// @body shopId
// return saveUser object
router.post("/service_Booking", verifyAccessToken, booking_Service);

router.post("/user_history_InStatus", verifyAccessToken, userHistory_InStatus);

// show all booking history of user
// @body userId
// return
router.post("/user_Booking_History", verifyAccessToken, user_BookingHistory);

// update user booking history
// @body bookingId
// return
router.post("/CancelBooking", verifyAccessToken, cancel_BookingHistory);

// edit user password
// @body oldPassword newPassword
// return
router.post("/editUserPassword", verifyAccessToken, edit_userPassword);

// upload user profile pic
// @body image
// return
router.post("/update_userProPic", verifyAccessToken, userPropic);

// user home page show all shops
// @nobody
// @noreturn
router.post("/find_allShops", userHomePage);

// @add FeedBack
// @body
// retrun
router.post("/add_feedback", verifyAccessToken, addFeedback);

// finding currnet frd
// @qurey
//

//
router.get("/getCurrentshop", findCurrentshop);

router.get("/user", async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const userDoc = await User.findById(userId);
    const shopDoc = await Shops.findById(userId);
    if (userDoc === null) res.status(200).json(shopDoc);
    if (shopDoc === null) res.status(200).json(userDoc);
  } catch (error) {
    next(error);
  }
});

router.post("/isLoggedin", verifyAccessToken, (req, res, next) => {
  let payload = req.payload;
  res.json({ user: true, payload });
});

// logout user
// nobody
// noreturn
router.post("/userLogout", verifyAccessToken, userLoggedOut);

router.post("/otpLogin", otpLogin);

router.post("/conformOtp", conformOtp);

router.post("/getingShop_rateing", verifyAccessToken, GettingShopRateing);

module.exports = router;
