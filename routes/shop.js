const express = require("express");
const router = express.Router();
const shopContoller = require("../controller/ShopContoller");

router.get("/", shopContoller.shopHome);

router.post("/login", shopContoller.loginShop);

router.post("/createShop", shopContoller.CreateShop);

router.post("/IsloggedIn", (req, res, next) => {
  // console.log("this is shop loggedin");
});

module.exports = router;
