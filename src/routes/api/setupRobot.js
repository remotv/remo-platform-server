const router = require("express").Router();
const { createRobot, deleteRobot } = require("../../models/robot");
const auth = require("../auth");
const { jsonError } = require("../../modules/logging");

router.get("/setup", async (req, res) => {
  res.send({
    username: "<Your User Name>", //This probably won't be needed
    robot_name: "<Name of Your Robot>",
    host_id: "<ID Of Server to host this robot>",
  });
  console.log("Send Robot Object");
});

router.post(
  "/setup",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { validateRobotName } = require("../../controllers/validate");

    let response = {};
    if (req.body.robot_name && req.body.host_id) {
      let robot_name = validateRobotName(req.body.robot_name);
      if (robot_name.error) {
        res.send(robot_name);
        return;
      }
    } else {
      res.send(jsonError("robot_name & host_id are required"));
    }
    response.result = await createRobot({
      robot_name: req.body.robot_name,
      host_id: req.body.host_id,
      owner: req.user,
    });
    res.send(response);
    return;
  }
);

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
