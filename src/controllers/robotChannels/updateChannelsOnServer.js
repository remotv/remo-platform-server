/**
 * - This shouldn't be sending data,
 * - It should just tell the client to pull updated channel data with a REST call
 */

module.exports.updateChannelsOnServer = async (server_id) => {
  const { emitEvent } = require("../models/robotServer");
  const { getRobotChannelsForServer } = require("../models/channel");
  const channels = await getRobotChannelsForServer(server_id);
  emitEvent(server_id, "CHANNELS_UPDATED", channels);
};
