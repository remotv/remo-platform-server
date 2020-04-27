/**
 * Rename robot_channel:
 * - todo: use a single query for getting server / channel information
 *
 * - returns updated channel w/ new name
 * - broadcasts to server with list of updated channels when done
 */

module.exports = async (user, channel_id, channel_name) => {
  const {
    updateRobotChannelName,
    getRobotChannelById,
  } = require("../../models/robotChannels");
  const { getRobotServer } = require("../../models/robotServer");
  const { authMemberRole } = require("../roles");
  const { checkName, updateChannelsOnServer, log } = require("./");

  try {
    log(`Rename robot_channel ${channel_id}, 
    to: ${channel_name}`);
    //Get database entries
    //TODO: THis can be a single query instead of two
    let channel = await getRobotChannelById(channel_id);
    let server = await getRobotServer(channel.server_id);
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
  } catch (err) {
    console.log(err);
    return { error: "Unable to process request, try again later." };
  }
};
