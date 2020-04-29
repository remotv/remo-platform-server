module.exports = async (user, channel_id) => {
  const { getControlsFromChannelId } = require("./");
  return await getControlsFromChannelId(channel_id, user);
};
