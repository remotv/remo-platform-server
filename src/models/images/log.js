module.exports = (message) => {
  const { logger } = require("../../modules/logging");
  logger({
    message: message,
    level: "debug",
    source: "models/images.js",
  });
};
