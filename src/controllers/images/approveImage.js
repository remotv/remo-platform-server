module.exports = async (image, server) => {
  const { approveImage, updateImageRef } = require("../../models/images");
  const { getRobotServer } = require("../../models/robotServer");
  const { updateServerImage } = require("../../models/robotServer");
  try {
    //  console.log("APPROVE IMAGE! ", image);
    if (!image.ref) throw new Error("Image requires ref to save");
    if (!server) server = await getRobotServer(image.ref);
    if (!server) throw new Error("Unable to find referenced server");
    if (image.approved === false) {
      await approveImage(image);
      return { status: "Image successfully not approved." };
    }
    if (
      image.approved === true &&
      server.image_id &&
      server.image_id !== image.id
    ) {
      //remove ref for old image, this will essencially mark it for deletion
      await updateImageRef({
        id: server.image_id,
        ref: null,
      });
      // console.log("REMOVE REF RESULT: ", removeRef);
      //replace reference with new image
      server.image_id = image.id;
      const updateServer = await updateServerImage({
        image_id: image.id,
        server_id: server.server_id,
      });
      const approve = await approveImage(image);
      if (updateServer && approve)
        return { status: "Image successfully approved", id: image.id };
    }
  } catch (err) {
    console.log("ERROR APPROVING IMAGE: ", err.message);
    return { error: "Error approving image...", details: err };
  }
  // return { error: "Error approving image..." };
};
