const { imageCLeanupInterval } = require("../../config");
module.exports = async () => {};

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
