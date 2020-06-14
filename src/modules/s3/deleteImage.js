// const multer = require("multer");
// const multerS3 = require("multer-s3");
const s3 = require("../../services/s3");
module.exports = async ({ id }) => {
  try {
    console.log("DELETE IMAGE: ", id);
    await s3.deleteObject(
      {
        Bucket: "remo-image-store",
        Key: `user/${id}`,
      },
      (err, data) => {
        if (err) {
          console.log("delete image error! ", err);
          return null;
        } else return true;
      }
    );
  } catch (err) {
    console.log("S3 DELETE ERROR: ", err);
    return null;
  }
};
