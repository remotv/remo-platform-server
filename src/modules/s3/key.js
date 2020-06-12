module.exports = async (req, file, cb) => {
  const { makeId } = require("../utilities");
  const { saveImage } = require("../../models/images");
  const wss = require("../../services/wss");
  // const { updateServerImage } = require("../../models/robotServer");
  try {
    const imageId = `imgs-${makeId()}`;

    //save image database object & make it accessible to req
    req.image = await saveImage({
      id: imageId,
      user_id: req.user.id,
      approved: null,
      ref: req.server.server_id, //reference to server
    });

    //REQUEST APPROVAL FROM MODS
    wss.emitInternalEvent("INTERNAL_REQUEST_IMG_APPROVAL", {
      user: req.user,
      image: req.image,
      path: `https://remo-image-store.sfo2.digitaloceanspaces.com/user/${req.image.id}`,
    });

    //consider allowing trusted users to bypass this mod check
    // const updateServer = await updateServerImage({
    //   server_id: req.server.server_id,
    //   image_id: imageId,
    // });

    //throw errors if something doesn't go right
    if (!req.image) {
      throw new Error("Error encounterd while saving image");
    }
    cb(null, "user/" + imageId); //all user generated images go here
  } catch (err) {
    console.log(err);
    cb(new Error("There was a problem saving the file"));
  }
};
