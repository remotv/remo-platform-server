module.exports = async () => {
  const { getAllImages, getImageById } = require("../../models/images");
  const { imageDeleter } = require("./");
  try {
    let imagesToDelete = [];
    const getImages = await getAllImages();
    console.log("IMAGES LENGTH: ", getImages.length);
    getImages.forEach((image) => {
      if (!image.ref || image.approved === false) imagesToDelete.push(image);
    });
    console.log("IMAGES TO DELETE: ", imagesToDelete.length);
    console.log("DELETE FIRST IMAGE TEST: ", imagesToDelete[0]);

    //test
  } catch (err) {
    console.log(err);
  }
  return null;
};
