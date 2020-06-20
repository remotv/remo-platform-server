const s3 = require("../../services/s3");
const { s3Bucket } = require("../../config");
module.exports = async (images) => {
  let deleteImages = [];
  if (!images) return;
  try {
    if (!Array.isArray(images)) images = [images];
    images.forEach((image) => {
      deleteImages.push({
        Bucket: s3Bucket,
        Key: `user/${image.id}`,
      });
    });

    console.log("DELETE IMAGE: ", id);
    s3.deleteObjects(deleteImages, (err, data) => {
      if (err) {
        console.log("delete image error! ", err);
        return null;
      } else return true;
    });
  } catch (err) {
    console.log("S3 DELETE ERROR: ", err);
    return null;
  }
};
