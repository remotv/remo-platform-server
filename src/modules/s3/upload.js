const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../../services/s3");
module.exports = multer({
  limits: require("./limits"),
  fileFilter: require("./fileFilter"),
  storage: multerS3({
    s3: s3,
    bucket: "remo-image-store",
    metadata: require("./metaData"),
    key: require("./key"),
  }),
});
