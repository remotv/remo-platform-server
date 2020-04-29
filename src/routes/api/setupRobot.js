const router = require("express").Router();
const auth = require("../auth");

router.get("/setup", async (req, res) => {
  res.status(200).send({
    warning:
      "Use /api/ver/channels for initial robot setup, this route now only manages auth.",
  });
  console.log("Send Robot Object");
});

router.post("/key", auth({ user: true, required: true }), async (req, res) => {
  const {
    createRobotAuth,
  } = require("../../controllers/robotChannels/robotChannelAuth");
  try {
    let response = await createRobotAuth(req.body.robot_id);
    if (!response.error) return res.status(201).send(response);
    else return res.status(400).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Unable to generate Token." });
  }
});

router.post("/auth", async (req, res) => {
  let response = {};
  const {
    authRobot,
  } = require("../../controllers/robotChannels/robotChannelAuth");
  try {
    let getRobot = await authRobot(req.body.token);
    if (getRobot) {
      response.status = "success!";
      response.robot = getRobot;
    } else {
      response.status = "error";
      response.error = "unable to authorize robot";
    }
  } catch (err) {
    console.log(err);
  }
  res.send(response);
});

module.exports = router;
