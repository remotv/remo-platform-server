/**
 * Images:
 *
 * @param {string} id
 * @param {string} user_id
 * @param {int} created
 * @param {bool} approved
 * @param {string} ref where does this image go?
 */

module.exports = {
  saveImage: require("./saveImage"),
  approveImage: require("./approveImage"),
  deleteImage: require("./deleteImage"),
  log: require("./log"),
  getAllImages: require("./getAllImages"),
  getImageById: require("./getImageById"),
  updateImageRef: require("./updateImageRef"),
};
