module.exports = async (user, channel_id) => {
  const { getControlsFromId } = require("./");
  return await getControlsFromId(channel_id, user);
};
