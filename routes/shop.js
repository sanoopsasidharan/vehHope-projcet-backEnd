const express = require("express");
const { verifyShopToken } = require("../config/jwt_helper");
const router = express.Router();
const {
  shopHome,
  loginShop,
  CreateShop,
  view_ShopProfile,
  view_shopBookingHistory,
  find_topShop,
} = require("../controller/ShopContoller");

router.post("/isShopLoggedIn", verifyShopToken, (req, res, next) => {
  const payload = req.payload;
  res.json({ shop: true, payload });
  // console.log("this is shop loggedin");
});
// @ shop home page
// @ no body
// @ no return
router.get("/", shopHome);

// @ shop login page
// @ no body
// @ no return
router.post("/login", loginShop);

// @ create shop
// @ body shop details
// @ return sucess response
router.post("/createShop", verifyShopToken, CreateShop);

// @ view shop profile
// @ body shopId
// @ return shopProfile objcet
router.post("/shop_profile", verifyShopToken, view_ShopProfile);

// @ view shop booking history
// @ body shopId
// @ return history array
router.post("/bookingHistory", view_shopBookingHistory);
// updatebookingHistory

// @most top shops
// @body
// return
router.post("/topShops", find_topShop);

// router.post("/h", (req, res) => {
//   console.log("fdja");
//   res.json({ sanoop: "fuck" });
// });

module.exports = router;
