module.exports = async (ws, data) => {
  const { updateServerImage } = require("../models/robotServer");
  const { approveImage } = require("../models/images");
  const wss = require("../services/wss");
  let result = [];
  try {
    if (ws.internalListener) {
      const approveImg = await approveImage(data);
      if (data.approved) {
        const updateServer = await updateServerImage({
          server_id: data.ref,
          image_id: data.id,
        });
        result.push(updateServer);
      }
      result.push(approveImg);
      wss.emitInternalEvent("INTERNAL_APPROVE_IMG_RESULT", result);
    }
  } catch (err) {
    console.log(err);
    result.push({ error: err });
  }
};
