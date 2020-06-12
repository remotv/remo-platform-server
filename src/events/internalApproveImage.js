module.exports = async (ws, data) => {
  const { updateServerImage } = require("../models/robotServer");
  const { approveImage, deleteImage } = require("../models/images");
  const wss = require("../services/wss");
  let result = [];
  try {
    if (data.approved) {
      const approveImg = await approveImage(data);
      const updateServer = await updateServerImage({
        server_id: data.ref,
        image_id: imageId,
      });
      result.push(approveImg, updateServer);
    } else {
      const removeImg = await deleteImage(data.id);
      result.push(removeImg);
    }
  } catch (err) {
    console.log(err);
    result.push(err);
  }
  wss.emitInternalEvent("INTERNAL_APPROVE_IMG_RESULT", result);
};
