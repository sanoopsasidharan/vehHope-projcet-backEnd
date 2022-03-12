var express = require("express");
var router = express.Router();
const userControll = require("../controller/userController");

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.json({ message: "jfajldfjla" });
// });

router.get("/", (req, res) => {
  res.json({ message: "get ?" });
});

router.get("/home", (req, res) => {
  res.json({ message: "get" });
});

router.post("/home", (req, res) => {
  res.json({ message: "post" });
});

router.post("/login", userControll.userLogin);

module.exports = router;
