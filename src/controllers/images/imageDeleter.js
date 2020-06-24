module.exports = async (img, justReplace) => {
  const {
    getServerByImageId,
    updateServerImage,
  } = require("../../models/robotServer");
  const { deleteImage } = require("../../modules/s3");
  const images = require("../../models/images");
  console.log("DELETING IMAGE: ", img);
  try {
    //Remove the image from S3 bucket
    deleteImage(img);

    //check to see if there is a pointer to this image
    if (!justReplace) {
      //required to stop race condition when approving new images
      const checkForUse = await getServerByImageId(img);
      console.log("CHECK FOR USE RESULT: ", checkForUse);

      //remove ref
      if (checkForUse)
        await updateServerImage({
          image_id: null,
          server_id: checkForUse.server_id,
        });
    }
    //Finally, remove the entry from the database
    images.deleteImage(img);
  } catch (err) {
    console.log("IMAGE DELETION ERROR: ", err);
  }
};
