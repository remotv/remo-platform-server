module.exports.cleanupImages = async () => {
  const { getAllImages } = require("../../models/images");
  try {
    const images = await getAllImages();
    console.log("IMAGES LENGTH: ", images.length);
    console.log("IMAGE 0:", images[0]);
  } catch (err) {
    console.log(err);
  }
  return null;
};
