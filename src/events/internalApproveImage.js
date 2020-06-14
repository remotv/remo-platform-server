module.exports = async (ws, data) => {
  const { approveImage } = require("../controllers/images");
  const wss = require("../services/wss");
  try {
    if (ws.internalListener) {
      const approve = await approveImage(data);
      wss.emitInternalEvent("INTERNAL_APPROVE_IMG_RESULT", approve);
    }
  } catch (err) {
    console.log(err);
    result.push({ error: err });
  }
};
