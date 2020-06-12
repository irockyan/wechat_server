var express = require("express");
var router = express.Router();
const Wechat = require("./wechat");

const config = require("../config/index");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("aa");
  res.render("index", { title: "Express" });
});
router.get("/checkSignature", (req, res, next) => {
  let wxConfig = config.wxConfig;
  const { signature, nonce, echostr, timestamp } = req.query;
  let checkConfig = { signature, nonce, timestamp, token: wxConfig.token };
  let wechat = new Wechat(checkConfig);
  if (wechat.checkSignature()) {
    res.end(echostr);
  } else {
    res.json({ msg: "微信签名未验证通过" });
  }
});

module.exports = router;
