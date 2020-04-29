module.exports = async (channel_id) => {
  const { getRobotChannelById } = require("../../models/robotChannels");
  const { getControlsFromId } = require("../../models/controls");
  const { exampleControls } = require("./");

  const channel = await getRobotChannelById(channel_id);
  const controls = await getControlsFromId(channel.controls_id);
  if (controls.buttons) return controls.buttons; //only send valid key / value pairs
  return exampleControls;
};
