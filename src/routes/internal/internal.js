const router = require("express").Router();
const auth = require("../auth");

router.get("/test", async (req, res) => {
  res.status(200).send({ test: "response " });
});

router.post(
  "/send-alert",
  auth({ internal: true, required: true }),
  async (req, res) => {
    console.log("/send-alert");
    const { alert } = req.body;

    console.log(req.internal, alert);
    return res.status(200).send(alert);
  }
);

module.exports = router;
