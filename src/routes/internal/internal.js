const router = require("express").Router();
const auth = require("../auth");

router.get("/test", async (req, res) => {
  res.status(200).send({ test: "response " });
});

router.post(
  "/send-alert",
  auth({ internal: true, required: true }),
  async (req, res) => {
    const { sendGlobalChatAlert } = require("../../controllers/internal");
    const { alert } = req.body;
    sendGlobalChatAlert(alert);
    return res
      .status(200)
      .send({ response: "Message processed.", alert: alert });
  }
);

module.exports = router;
