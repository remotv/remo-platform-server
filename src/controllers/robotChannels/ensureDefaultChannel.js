/**
 * - Ensures a server has a default channel
 * - returns true when complete
 */

module.exports = async (server_id, channel_id) => {
  const { getRobotChannelsForServer } = require("../../models/robotChannels");
  const {
    getRobotServer,
    updateRobotServerSettings,
    updateRobotServer,
  } = require("../../models/robotServer");
  const getServer = await getRobotServer(server_id);
  if (getServer.settings.default_channel === channel_id) {
    let { settings } = getServer;
    newDefault = await getRobotChannelsForServer(server_id);
    settings.default_channel = newDefault[0].id;
    await updateRobotServerSettings(server_id, settings);
    updateRobotServer();
  }
  return true;
};
