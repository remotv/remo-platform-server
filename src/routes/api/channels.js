const router = require("express").Router();
const auth = require("../auth");

/**
 * Channels has been refactored:
 * - new model combines channels and robots into robot_channels
 * - internal methods have been updated to reflect this
 */

//get list of channels on a server
router.get("/list/:id", async (req, res) => {
  const { getRobotChannelsForServerId } = require("../../models/robotChannels");
  const { jsonError } = require("../../modules/logging");
  try {
    const result = await getRobotChannelsForServerId(req.params.id);
    if (result && !result.error)
      return res.status(200).send({ channels: result });
  } catch (err) {
    console.log(err);
  }
  return res.status(500).send(jsonError("Unable to process request"));
});

//get requirements for creating a channel
router.get("/create", async (req, res) => {
  let response = {};
  response.server_id = "<Please provide a server_id to add channel too >";
  response.channel_name = "<Please provide a name for your new channel>";
  response.authorization = "required";
  res.status(200).send(response);
});

/**
 * Create Robot Channel: api/dev/create
 * auth: required
 * method: post
 *
 * @param {string} user
 * @param {string} channel_name name of channel
 * @param {string} server_id id of server to add channel
 *
 * Response Success: 201
 * @returns {robot_channel}
 *
 * Response Error: 400
 * @returns {error}
 *
 */
router.post(
  "/create",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { jsonError } = require("../../modules/logging");
    const { createRobotChannel } = require("../../controllers/robotChannels");
    try {
      const { channel_name, server_id } = req.body;
      const make = await createRobotChannel({
        name: channel_name,
        server_id: server_id,
        user_id: req.user.id,
      });
      if (!make.error) return res.status(201).send(make);
      return res.status(400).send(make);
    } catch (err) {
      console.log(err);
      return res.status(400).send(jsonError("Unable to make channel"));
    }
  }
);

router.get("/delete", async (req, res) => {
  response = {};
  response.channel_id = "<Channel ID Required>";
  response.authorization = "<Authorization Required>";
  return res.status(200).send(response);
});

/**
 * Delete Channel:
 * Input Required: user Object, channel_id
 * Response Success: { status: "success!", result: { deleted channel }}
 * Response Error: { error: "Error Message" }
 */
router.post(
  "/delete",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { deleteRobotChannel } = require("../../controllers/robotChannels");
    try {
      let response = {};
      if (req.body.channel_id && req.body.server_id && req.user)
        response.channel_id = req.body.channel_id;
      response.server_id = req.body.server_id;
      response.user = { username: req.user.username, id: req.user.id };

      const doDelete = await deleteRobotChannel(req.user, req.body.channel_id);
      if (doDelete.error) return res.status(400).send(doDelete);
      response.validated = true;
      response.status = doDelete.status;
      return res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "unable to process request" });
    }
  }
);

/**
 * Set Default Channel:
 * Input Required: user Object, channel_id, server_id
 * Response Success: { server: { settings } }
 * Response Error: { error: "Error Message" }
 */
router.post(
  "/set-default",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { jsonError } = require("../../modules/logging");
    const { setDefaultChannel } = require("../../controllers/robotChannels");
    try {
      if (req.body.channel_id && req.body.server_id) {
        const { channel_id, server_id } = req.body;
        const setDefault = await setDefaultChannel(
          req.user,
          channel_id,
          server_id
        );
        res.send(setDefault);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send(jsonError("Unable to process request"));
    }
    return res
      .status(400)
      .send(jsonError("parameters required, { server_id, channel_id }"));
  }
);

/**
 * Rename Channel:
 * Inputs:
 *  auth: ( string ) Bearer Token from User
 *  id: ( string ) channel id
 *  name: ( string ) new channel name
 *
 * Response Success: { channel, { name: "New Name" }}
 * Response Error: { error: "Error Message" }
 */
router.post(
  "/rename",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { renameChannel } = require("../../controllers/robotChannels");
    const { jsonError } = require("../../modules/logging");
    try {
      const { id, name } = req.body;
      if (id && name) {
        const result = await renameChannel(req.user, id, name);
        return res.status(201).send(result);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(jsonError("Unable to process request"));
    }

    return res
      .status(400)
      .send(jsonError("missing required params for robot_channel: name, id"));
  }
);

module.exports = router;
