// module.exports = async () => {};

/**
 * Notes:
 * S3 File Deletion Callback can take a while, need to figure out a method for ensuring
 * images are deleted before removing the database entry.
 * Might need an internal database object for this kind of stuff.
 */
const handleCleanup = async () => {
  const { getAllImages, deleteImage } = require("../../models/images");
  const { deleteImages } = require("../../modules/s3");

  try {
    let imagesToDelete = [];
    const getImages = await getAllImages();
    console.log("IMAGE CLEANUP, checking images: ", getImages.length);
    getImages.forEach((image) => {
      if (!image.ref || image.approved === false) imagesToDelete.push(image);
    });
    console.log("IMAGES TO DELETE: ", imagesToDelete.length);
    //remove images from bucket:
    deleteImages(imagesToDelete);
    //remove database refs
    imagesToDelete.forEach(image => {
      const remove = await deleteImage(image);
      console.log(remove);
    })
    //test
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports = handleCleanup;
