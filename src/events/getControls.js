const { getControlsFromChannelId } = require("../controllers/controls");
const { logger } = require("../modules/logging");
const log = (message) => {
  logger({
    level: "debug",
    source: "events/getControls.js",
    message: message,
  });
};

module.exports = async (ws, channel) => {
  logger({
    level: "debug",
    source: "events/getControls.js",
    message: `SUBBING USER TO CONTROLS: ${channel.id}, ${channel.controls}`,
  });

  try {
    if (channel && channel.id) {
      const getControls = await getControlsFromChannelId(channel.id, ws.user);
      ws.emitEvent("GET_USER_CONTROLS", getControls);

      //Subscribe user to controls
      ws.controls_id = getControls.id;
      if (ws.user) {
        log(`Subbing user: ${ws.user.username} to controls: ${getControls.id}`);
      } else if (ws.robot) {
        log(`Subbing robot: ${ws.robot.id} to controls: ${getControls.id}`);
      }
    } else {
      log(
        `NO CONTROLS IDENTIFIED FOR CHANNEL ${
          channel.name ? channel.name : "Unknown Channel"
        }, creating new controls!`
      );
      //Um, really?
    }
  } catch (err) {
    logger({
      level: "error",
      source: "events/getControls.js",
      message: err,
    });
  }
};
