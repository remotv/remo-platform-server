module.exports = async (channel_id, user) => {
  const { getRobotServer } = require("../../models/robotServer");
  const { getRobotChannelById } = require("../../models/robotChannels");
  const { getControlsFromId } = require("../../models/controls");
  const { logger } = require("../../modules/logging");
  const { log } = require("./");
  const { getButtonStatus } = require("./getStatus");
  const { authMemberRole } = require("../../controllers/roles");

  if (!user) log(`Get controls for Null User`);
  else log(`Get Controls from ID: ${channel_id}, ${user.username}`);

  const channel = await getRobotChannelById(channel_id);
  const controls = await getControlsFromId(channel.controls_id);

  controls.channel_id = channel_id; //NOTE 2

  let sendButtons = [];
  if (controls && controls.buttons) {
    const { buttons } = controls;
    const getServer = await getRobotServer(channel.server_id);
    const testy = async (button) => {
      if (button.cooldown) button = await getButtonStatus(button); //attach button status
      if (user && button.access) {
        const auth = await authMemberRole(user, getServer, button.access);
        if (auth) return button;
      } else if (!user) {
        button.disabled = true;
        return button;
      } else return button;
    };

    sendButtons = await Promise.all(buttons.map((button) => testy(button)));
    sendButtons = sendButtons.filter((button) => button != undefined);
    //await Promise.all(testy);
  }
  if (controls.buttons && sendButtons) {
    controls.buttons = sendButtons;
  } else {
    logger({
      level: "error",
      source: "controllers/controls.js",
      message: "Unable to Fetch Controls",
    });
  }
  return controls;
};
