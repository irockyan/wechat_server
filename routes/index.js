var express = require("express");
var router = express.Router();
const Wechat = require("./wechat");
const xml2js = require("xml2js");

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
router.post("/checkSignature", (req, res, next) => {
  let from = req.body.xml.FromUserName;
  let to = req.body.xml.ToUserName;
  var builder = new xml2js.Builder({
    allowSurrogateChars: true,
  });
  var xml = builder.buildObject({
    xml: {
      ToUserName: from,
      FromUserName: to,
      CreateTime: Date.now(),
      MsgType: "text",
      Content: "你好",
    },
  });
  res.set("Content-Type", "text/xml");
  console.log('111')
  res.end(xml);
});
router.get("/initToken", (req, res, next) => {
  let wxConfig = config.wxConfig;
  let wechat = new Wechat({ wxConfig: wxConfig });
  wechat.getAccessTokenByFile().then((data) => {
    res.json(data);
  });
});

module.exports = router;
