const sha1 = require("sha1");

class Wechat {
  constructor(config) {
    this.signature = config.signature;
    this.timestamp = config.timestamp;
    this.nonce = config.nonce;
    this.token = config.token;
  }
  //与服务器验签
  checkSignature() {
    let tmpArr = [this.token, this.timestamp, this.nonce];
    tmpArr.sort();
    let tmpStr = tmpArr.join("");
    let sha = sha1(tmpStr);

    if (sha == this.signature) {
      return true;
    } else {
      return false;
    }
  }
  //获取票据
}

module.exports = Wechat;
