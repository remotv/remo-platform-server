/**
 * Images:
 *
 * @param {string} id
 * @param {string} user_id
 * @param {int} created
 * @param {bool} approved
 */

module.exports = {
  saveImage: require("./saveImage"),
  approveImage: require("./approveImage"),
  deleteImage: require("./deleteImage"),
  log: require("./log"),
};
