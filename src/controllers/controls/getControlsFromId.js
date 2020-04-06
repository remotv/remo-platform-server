module.exports = async (channel_id, user) => {
  const { getServerIdFromChannelId } = require("../../models/channel");
  const { getRobotServer } = require("../../models/robotServer");
  const { getChannel } = require("../../models/channel");
  const { getControlsFromId } = require("../../models/controls");
  const { logger } = require("../../modules/logging");
  const { log } = require("./");
  const { getButtonStatus } = require("./getStatus");
  const { authRole } = require("../../controllers/roles");

  log(`Get Controls from ID: ${channel_id}, ${user.username}`);
  let controls = await getChannel(channel_id);
  controls = await getControlsFromId(controls.controls);

  let sendButtons = [];
  if (controls && controls.buttons) {
    const { buttons } = controls;
    const getServerId = await getServerIdFromChannelId(channel_id);
    const getServer = await getRobotServer(getServerId.result);
    const testy = async button => {
      button = await getButtonStatus(button);
      if (user && button.access) {
        const auth = await authRole(user, getServer, button.access);
        if (auth) return button;
      } else return button;
    };

    sendButtons = await Promise.all(buttons.map(button => testy(button)));
    sendButtons = sendButtons.filter(button => button != undefined);
    //await Promise.all(testy);
  }
  if (controls.buttons && sendButtons) {
    controls.buttons = sendButtons;
  } else {
    logger({
      level: "error",
      source: "controllers/controls.js",
      message: "Unable to Fetch Controls"
    });
  }
  return controls;
};
