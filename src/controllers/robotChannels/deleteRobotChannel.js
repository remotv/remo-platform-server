module.exports = async (user, channel_id) => {
  const {
    deleteRobotChannel,
    getRobotChannelById,
    getRobotChannelsForServer,
  } = require("../../models/robotChannels");
  const { authMemberRole } = require("../roles");
  const {
    ensureDefaultChannel,
    updateChannelsOnServer,
  } = require("../robotChannels");
  const { log } = require("./");

  let response = {};
  try {
    log("Delete Channel");

    //get channel from database
    const getChannel = await getRobotChannelById(channel_id);
    log(`Channel retrieved from database: ${getChannel.name}`);

    //authorize user action
    const auth = authMemberRole(user, getChannel.server_id);
    log(`Authorization Check: ${auth}`);
    if (!auth) return { error: "You are not authorized to do this action" };

    //Do not delete the last channel on a server
    const checkChannelCount = await getRobotChannelsForServer(
      getChannel.server_id
    );
    log(`Channel Count Check: ${checkChannelCount.length}`);
    if (checkChannelCount && checkChannelCount.length <= 1) {
      return jsonError(
        "Unable to delete channel, server must contain at least one channel."
      );
    }

    log(`Removing Channel: ${getChannel.name}`);
    const remove = await deleteRobotChannel(getChannel.id);
    if (!remove) return { error: "Unable to delete channel, try again later" };
    response.status = "success!";
    response.result = remove;
    response.validated = true;
    log(`Channel Deleted Successfully, ensuring default channel`);
    await ensureDefaultChannel(getChannel.server_id, getChannel.id);
    updateChannelsOnServer(getChannel.server_id);

    log("...Channel Deletion Complete");
    return response;
    //}
  } catch (err) {
    console.log(err);
    return {
      error: "Server could not complete request, please try again later",
    };
  }
};
