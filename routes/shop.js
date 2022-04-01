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
  ChangeBookingStatus,
  update_ShopProfile,
} = require("../controller/ShopContoller");
const { addServiceNote } = require("../controller/serviceController");

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
router.post("/bookingHistory", verifyShopToken, view_shopBookingHistory);

// updatebookingHistory

// change booking status
router.post("/ChangeBookingStatus", verifyShopToken, ChangeBookingStatus);

// @most top shops
// @body
// return
router.post("/topShops", find_topShop);

// @update shop profile
// @body
// @return
router.post("/update_ShopProfile", verifyShopToken, update_ShopProfile);

// @addService Note
// @body nextSrviceKm,workerName,serviceDescription
// return
router.post("/addServiceNote", verifyShopToken, addServiceNote);

// router.post("/h", (req, res) => {
//   console.log("fdja");
//   res.json({ sanoop: "fuck" });
// });

module.exports = router;
