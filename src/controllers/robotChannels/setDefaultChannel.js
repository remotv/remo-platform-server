module.exports = async (user, channel_id, server_id) => {
  const { authMemberRole } = require("../roles");
  const { getRobotChannel } = require("../../models/robotChannels");
  const {
    getRobotServer,
    updateRobotServerSettings,
  } = require("../../models/robotServer");
  const { updateSelectedServer } = require("../robotServer");

  //get server information:
  const server = await getRobotServer(server_id);
  if (!server) return jsonError(`Unable to find server with id: ${server_id}`);
  let { settings } = server;

  //Auth User
  const auth = await authMemberRole(user, server);
  if (!auth) return jsonError("Not Authorized");

  //verify channel exists:
  const checkChannel = await getRobotChannel(channel_id);
  if (checkChannel.error) return checkChannel;

  //Update Settings:
  settings.default_channel = checkChannel.id;
  const updateSettings = await updateRobotServerSettings(
    server.server_id,
    settings
  );
  if (!updateSettings) return jsonError("Could not update settings for server");
  updateSelectedServer(server.server_id);
  // console.log("Update Settings Result: ", updateSettings);
  return updateSettings;
};
