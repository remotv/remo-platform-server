module.exports = async (img) => {
  const {
    getServerByImageId,
    updateServerImage,
  } = require("../../models/robotServer");
  const { deleteImage } = require("../../modules/s3");
  const images = require("../../models/images");
  console.log("DELETING IMAGE: ", img);
  try {
    //Remove the image from S3 bucket
    const deleteFromS3 = deleteImage(img);

    //On success, purge image from database
    if (deleteFromS3) {
      //check to see if there is a pointer to this image
      const checkForUse = await getServerByImageId(img);
      console.log("CHECK FOR USE RESULT: ", checkForUse);

      //remove ref
      if (checkForUse)
        await updateServerImage({
          image_id: null,
          server_id: checkForUse.server_id,
        });

      //Finally, remove the entry from the database
      const deleteFromDb = await images.deleteImage(img);
      console.log("DELETE FROM DB RESULT: ", deleteFromDb);
      if (!deleteFromDb) console.log("unable to delete image: ", img.id);
    } else console.log("UNABLE TO DELETE IMAGE");
  } catch (err) {
    console.log("IMAGE DELETION ERROR: ", err);
  }
};
