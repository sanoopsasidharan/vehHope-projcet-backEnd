const express = require("express");
const { verifyAdminToken } = require("../config/jwt_helper");
const router = express.Router();
const adminController = require("../controller/adminController");

router.get("/", (req, res) => {
  res.json({ mes: "admin Home page" });
});

// @admin verification router
router.post("/adminIsLoggedIn", verifyAdminToken, (req, res, next) => {});

// admin login
// @body email password
// @return
router.post("/login", adminController.admin_Login);

// @user list
// @nobody
// @return users array
router.get("/get_allUsers", adminController.get_AllUsers);

// @user list
// @nobody
// @return users array
router.get("/getingUsers", adminController.getingUsers);

// @block and unblock user
// @body userId block(true/fales)
// @return  update(true)
router.post("/block_UnblockUser", adminController.block_UnblockUser);

// @shop list
// @nobody
// @return shops array
router.get("/get_allShops", adminController.get_Allshops);

// @shop list
// @nobody
// @return shops array
router.get("/gettingShops", adminController.gettingShops);

// @find Shop
// @nobody
// @return shops array
router.get("/getShop", adminController.findShop);

// @update shop active
// @body shopId active(true/false)
// @return update(true)
router.post("/update_shopActive", adminController.update_ShopActive);

module.exports = router;
