module.exports = async ({ name, server_id }) => {
  const { validateChannelName } = require("../validate");
  const { getRobotChannelsForServer } = require("../../models/robotChannels");
  if (!name || !server_id)
    return { error: "missing required values for { name, server_id }" };
  try {
    name = validateChannelName(name);
    if (name.error) return name;
    const checkForDupes = await getRobotChannelsForServer(server_id);
    let isDupe = false;
    checkForDupes.forEach((dupe) => {
      if (dupe.name.toLowerCase() === name.toLowerCase()) isDupe = true;
    });
    if (isDupe) return { error: "You cannot have duplicate channel names." };
  } catch (err) {
    console.log(err);
    return { error: "checkName.js validation error" };
  }
  return name;
};

module.exports.test = async ({ name, server_id }) => {
  const checkName = module.exports;
  try {
    return await checkName({
      name: name || null,
      server_id: server_id || null,
    });
  } catch (err) {
    console.log("fart", err);
  }
};
