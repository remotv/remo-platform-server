module.exports.deleteChannel = async (user, channel_id) => {
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

  let response = {};
  try {
    const getChannel = await getRobotChannelById(channel_id);
    const auth = authMemberRole(user, getChannel.server_id);
    if (!auth) return { error: "You are not authorized to do this action" };
    const checkChannelCount = await getRobotChannelsForServer(server_id);
    if (checkChannelCount && checkChannelCount.length <= 1) {
      return jsonError(
        "Unable to delete channel, server must contain at least one channel."
      );
    }

    const remove = await deleteRobotChannel(getChannel.id);
    if (!remove) return { error: "Unable to delete channel, try again later" };
    response.status = "success!";
    response.result = remove;
    await ensureDefaultChannel(getChannel.server_id, getChannel.id);
    updateChannelsOnServer(getChannel.server_id);
    return response;
    //}
  } catch (err) {
    response.error = err;
    response.status = "error!";
    console.log(response);
    return response;
  }
};
