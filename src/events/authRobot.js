const { authRobot } = require("../controllers/robotChannels/robotChannelAuth");
const { logger } = require("../modules/logging");
const log = (message) => {
  logger({
    message: message,
    level: "debug",
    source: "events/joinChannel.js",
  });
};

module.exports = async (ws, data) => {
  const getRobot = await authRobot(data.token);
  if (getRobot) {
    //setup private user sub for user events
    ws.robot = getRobot;

    log(`AUTH ROBOT: ${getRobot.name}`);

    //Confirm Validation:
    ws.emitEvent("ROBOT_VALIDATED", {
      id: getRobot.id,
      host: getRobot.server_id,
    });
  } else {
    log(`No data returned from authRobot: ${getRobot}`);
  }
};
