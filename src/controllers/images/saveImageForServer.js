module.exports = async (user, server) => {
  const { makeId } = require("../../modules/utilities");
  const { saveImage } = require("../../models/images");
  const { approveImage } = require("./");
  const { autoApproveServerImages } = require("../../config");
  const wss = require("../../services/wss");

  try {
    const imageId = `imgs-${makeId()}`;
    const img = await saveImage({
      id: imageId,
      user_id: user.id,
      approved: null,
      ref: server.server_id, //reference to server
    });

    //IF LOCAL ENVIRONEMNT IS SET TO AUTO APPROVE, ELSE GET REQUEST MOD APPROVAL
    if (autoApproveServerImages === true) {
      img.approved = true;
      await approveImage(img, server);
    } else {
      //REQUEST APPROVAL FROM MODS
      wss.emitInternalEvent("INTERNAL_REQUEST_IMG_APPROVAL", {
        user: user,
        image: img,
        path: `https://remo-image-store.sfo2.digitaloceanspaces.com/user/${img.id}`,
      });
    }

    //throw errors if something doesn't go right
    return img;
  } catch (err) {
    console.log(err);
  }
  return null;
};
