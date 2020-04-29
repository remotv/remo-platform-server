const router = require("express").Router();
const { jsonError } = require("../../modules/logging");
const auth = require("../auth");
// then to use that it would be like router.post('/test', auth({robot: true, user: true}), (req, res ) => { ... })

router.get("/", async (req, res) => {
  res.send({ message: "get controls" });
});

router.post(
  "/make",
  auth({ robot: true, user: true, required: true }),
  async (req, res) => {
    let response = {};
    let validate = false;
    const { getRobotChannelById } = require("../../models/robotChannels");
    const { buildButtons } = require("../../controllers/controls");
    const { getRobotServer } = require("../../models/robotServer");

    const checkForControls = await getRobotChannelById(req.body.channel_id);

    const robotServer = await getRobotServer(checkForControls.server_id);

    if (!robotServer) {
      res.status(500).json({
        status: "error!",
        error: "failed to get robot server",
      });
      return;
    }

    if (req.robot) {
      if (robotServer.server_id === req.robot.server_id) validate = true;
    } else if (req.user) {
      if (robotServer.owner_id === req.user.id) validate = true;
    }

    if (req.body.channel_id && req.body.buttons && validate) {
      console.log("BUTTONS LENGTH: ", req.body.buttons.length);

      const setControls = await buildButtons(
        req.body.buttons,
        req.body.channel_id,
        checkForControls.controls_id
      );
      if (setControls.error) return res.send(setControls);

      response.status = "success";
      response.result = setControls;
    } else {
      response.status = "error!";
      response.error = "could not generate controls from input";
    }
    res.send(response);
  }
);

//get JSON for editing channel buttons
router.post("/button-input", async (req, res) => {
  if (req.body.channel_id) {
    const { getButtonInputForChannel } = require("../../controllers/controls");
    const input = await getButtonInputForChannel(req.body.channel_id);
    res.send(input);
    return;
  }
  res.send(jsonError("Unable to get button input!"));
});

//Get channel's buttons based on user
router.post(
  "/get-controls",
  auth({ user: true, required: true }),
  async (req, res) => {
    if (req.body.channel_id) {
      const { getButtonInputForUser } = require("../../controllers/controls");
      const sendButtons = await getButtonInputForUser(
        req.user,
        req.body.channel_id
      );
      if (sendButtons) {
        res.send(sendButtons);
        return;
      }
    }
    res.send(jsonError("Unable to get buttons for user!"));
  }
);

module.exports = router;
