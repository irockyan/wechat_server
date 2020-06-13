const sha1 = require('sha1')
const fs = require('fs/promises')
const path = require('path')
const request = require('request')

class Wechat {
  constructor(config) {
    this.signature = config.signature
    this.timestamp = config.timestamp
    this.nonce = config.nonce
    this.token = config.token
    this.path = path.join(__dirname, '../config/token')
    this.wxConfig = config.wxConfig
  }
  //与服务器验签
  checkSignature() {
    let tmpArr = [this.token, this.timestamp, this.nonce]
    tmpArr.sort()
    let tmpStr = tmpArr.join('')
    let sha = sha1(tmpStr)

    if (sha == this.signature) {
      return true
    } else {
      return false
    }
  }
  //获取票据
  getAccessTokenByFile() {
    return fs
      .readFile(this.path)
      .then((res) => {
        let token = JSON.parse(res)
        if (!this.isValidAccessToken(token)) {
          this.updateAccessToken()
        } else {
          return token
        }
      })
      .catch((res) => {
        this.updateAccessToken()
      })
  }
  saveAccessTokenToFile(data) {
    data = JSON.stringify(data)
    fs.writeFile(this.path, data).then((res) => {
      console.log('写入成功')
    })
  }
  isValidAccessToken(data) {
    let now = Date.now()
    let locTime = data.expires_in
    if (now > locTime || !data) {
      return false
    } else {
      return true
    }
  }
  updateAccessToken() {
    request(
      {
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.wxConfig.appId}&secret=${this.wxConfig.appsecret}`,
        json: true,
      },
      (err, res, body) => {
        if (err) {
          console.log(err)
        } else {
          body.expires_in = Date.now() + (body.expires_in - 20) * 1000
          console.log(body.expires_in)
          this.saveAccessTokenToFile(body)
        }
      }
    )
  }
}

module.exports = Wechat
