const { imageCLeanupInterval } = require("../../config");
module.exports = async () => {};

/**
 * Notes:
 * S3 File Deletion Callback can take a while, need to figure out a method for ensuring
 * images are deleted before removing the database entry.
 * Might need an internal database object for this kind of stuff.
 */
const handleCleanup = async () => {
  const { getAllImages, getImageById } = require("../../models/images");
  const { imageDeleter } = require(".");
  try {
    let imagesToDelete = [];
    const getImages = await getAllImages();
    console.log("IMAGE CLEANUP, checking images: ", getImages.length);
    getImages.forEach((image) => {
      if (!image.ref || image.approved === false) imagesToDelete.push(image);
    });
    console.log("IMAGES TO DELETE: ", imagesToDelete.length);

    //test
  } catch (err) {
    console.log(err);
  }
  return null;
};
