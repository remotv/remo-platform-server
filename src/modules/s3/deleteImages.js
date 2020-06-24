const s3 = require("../../services/s3");
const { s3Bucket } = require("../../config");
module.exports = async (images) => {
  let deleteImages = [];
  if (!images) return;
  try {
    if (!Array.isArray(images)) images = [images];
    images.forEach((image) => {
      if (!image.id) {
        console.log("err, no image id", image);
        return;
      }
      deleteImages.push({
        //   Bucket: s3Bucket,
        Key: `user/${image.id}`,
      });
      console.log("DELETE IMAGE: ", image.id);
    });

    if (deleteImages.length > 0) {
      s3.deleteObjects(
        {
          Bucket: s3Bucket,
          Delete: {
            Objects: deleteImages,
          },
        },
        (err, data) => {
          if (err) {
            console.log("delete image error! ", err);
            return null;
          } else return true;
        }
      );
    } else console.log("NO IMAGES TO DELETE!");
  } catch (err) {
    console.log("S3 DELETE ERROR: ", err);
    return null;
  }
};
