var fs = require("fs");
var express = require("express");
var router = express.Router();

let writableVideo;
/* GET home page. */
router.post("/", function (req, res, next) {
  handleRequest(req);

  res.send("hola");
});

const handleRequest = (req) => {
  const start = req.headers["x-start"] === "true";
  const end = req.headers["x-end"] === "true";
  if (start) {
    writableVideo = new fs.createWriteStream(
      req.headers["x-name"] + ".mp4",
      "base64"
    );
  }
  if (writableVideo) {
    writableVideo.write(req.body.toString("base64"));
  }
  if (end) {
    if (writableVideo) {
      writableVideo.close();
      console.log("File successfully wrote!");
    }
  }
};

module.exports = router;
