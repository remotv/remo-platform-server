const { logger } = require("../../modules/logging");
module.exports = (message) => {
  logger({
    message: message,
    level: "debug",
    source: "/src/controllers/robotChannels",
  });
};
