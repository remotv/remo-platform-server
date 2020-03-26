const { logger } = require("../../modules/logging");
module.exports = message => {
  logger({
    level: "debug",
    source: "controllers/controls",
    message: message
  });
};
