module.exports = async (user, channel_id, channel_name) => {
  const {
    updateRobotChannelName,
    getRobotChannel,
  } = require("../models/channel");
  const { getRobotServer } = require("../../models/robotServer");
  const { authMemberRole } = require("../roles");
  const { checkName, updateChannelsOnServer } = require(".");

  //Get database entries
  //TODO: THis can be a single query instead of two
  let channel = await getRobotChannel(channel_id);
  let server = await getRobotServer(channel.server_id);
  if (!channel || !server) return "Unable to get data needed for update";
  channel.name = channel_name;

  //Role Check
  const validate = await authMemberRole(user, server);
  if (!validate) return jsonError("Not Authorized");

  //Ensure channel name is formatted correctly, and isn't a duplicate name.
  const nameCheck = await checkName(channel);
  if (nameCheck.error) return nameCheck;

  //rename the channel:
  const update = await updateRobotChannelName({
    name: channel.name,
    id: channel.id,
  });

  // console.log("Update Selected Server: ", server.server_id);
  updateChannelsOnServer(server.server_id);
  return update;
};
