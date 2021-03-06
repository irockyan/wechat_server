const xml2js = require("xml2js");

module.exports = {
  xmlBodyParser(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};

    // ignore GET
    if ("GET" == req.method || "HEAD" == req.method) return next();
    // check Content-Type
    if ("text/xml" != req.headers["content-type"]) return next();
    // flag as parsed
    req._body = true;

    // parse
    var buf = "";
    req.setEncoding("utf8");
    req.on("data", function (chunk) {
      buf += chunk;
    });
    req.on("end", function () {
      var parseString = xml2js.parseString;
      parseString(buf, function (err, json) {
        if (err) {
          err.status = 400;
          next(err);
        } else {
          req.body = json;
          next();
        }
      });
    });

    //res
    console.log(222);
    console.log(res);
  },
};
