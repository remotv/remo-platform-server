module.exports = async channel_id => {
  const { getChannel } = require("../../models/channel");
  const { getControlsFromId } = require("../../models/controls");
  const { exampleControls } = require("./");

  const channel = await getChannel(channel_id);
  const controls = await getControlsFromId(channel.controls);
  if (controls.buttons) return controls.buttons; //only send valid key / value pairs
  return exampleControls;
};
