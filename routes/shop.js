const express = require("express");
const router = express.Router();
const shopContoller = require("../controller/ShopContoller");

router.post("/IsloggedIn", (req, res, next) => {
  // console.log("this is shop loggedin");
});
// @ shop home page
// @ no body
// @ no return
router.get("/", shopContoller.shopHome);

// @ shop login page
// @ no body
// @ no return
router.post("/login", shopContoller.loginShop);

router.post("/createShop", shopContoller.CreateShop);

// @ view shop profile
// @ body shopId
// @ return shopProfile objcet
router.post("/shop_profile", shopContoller.view_ShopProfile);

// @ view shop booking history
// @ body shopId
// @ return history array
router.post("/bookingHistory", shopContoller.view_shopBookingHistory);

module.exports = router;
