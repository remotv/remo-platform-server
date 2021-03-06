const router = require("express").Router();
const auth = require("../auth");

/**
 * Channels has been refactored:
 * - new model combines channels and robots into robot_channels
 * - internal methods have been updated to reflect this
 */

//get list of channels on a server
router.get("/list/:id", async (req, res) => {
  const { getRobotChannelsForServer } = require("../../models/robotChannels");
  const { jsonError } = require("../../modules/logging");
  try {
    const result = await getRobotChannelsForServer(req.params.id);
    //old formatting fix
    for (channel of result) {
      channel.chat = channel.chat_id;
      delete channel.chat_id;
    }
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
 * notes:
 *  - currently triggers ws event on success that sends updated list of all channels
 *  - will include updated list in response as well
 *
 * @param {string} user
 * @param {string} channel_name name of channel
 * @param {string} server_id id of server to add channel
 *
 * Response Success: 201
 *    returns:  { robot_channel }
 *    triggers: websocket update, "CHANNELS UPDATED", [ ...robot_channels ]
 *
 * Response Error: 400 ( bad request ), 500 ( internal error )
 *     returns: { error }
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
        user: req.user,
      });
      if (!make.error) return res.status(201).send(make);
      return res.status(400).send(make);
    } catch (err) {
      console.log(err);
      return res.status(500).send(jsonError("Unable to make channel"));
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
      let response = await deleteRobotChannel(req.user, req.body.channel_id);
      if (response.error) return res.status(400).send(response);
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
    console.log("Set Default Channel: ", req.body);
    try {
      if (req.body.channel_id && req.body.server_id) {
        const { channel_id, server_id } = req.body;
        const setDefault = await setDefaultChannel(
          req.user,
          channel_id,
          server_id
        );
        return res.send(setDefault);
      } else {
        return res
          .status(400)
          .send(jsonError("parameters required, { server_id, channel_id }"));
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send(jsonError("Unable to process request"));
    }
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
        if (result.error) return res.status(500).send(result);
        return res.status(201).send(result);
      } else
        return res
          .status(400)
          .send(
            jsonError("missing required params for robot_channel: name, id")
          );
    } catch (err) {
      console.log(err);
      res.status(500).send(jsonError("Unable to process request"));
    }
  }
);

module.exports = router;
