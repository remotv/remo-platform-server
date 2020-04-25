module.exports = async ({ name, server_id }) => {
  const { validateChannelName } = require("../validate");
  const { getRobotChannelsForServer } = require("../models/robot_channels");
  try {
    const validate = validateChannelName(name);
    if (validate.error) return validate;
    const checkForDupes = await getRobotChannelsForServer(server_id);
    let isDupe = false;
    checkForDupes.forEach((dupe) => {
      if (dupe.name === name) isDupe = true;
    });
    if (isDupe) return { error: "You cannot have duplicate channel names." };
  } catch (err) {
    console.log(err);
  }
  return name;
};
