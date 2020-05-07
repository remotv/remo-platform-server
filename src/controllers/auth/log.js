module.exports = (message) => {
  const { logger } = require("../../modules/logging");
  logger({
    level: "debug",
    source: "/controllers/auth",
    message: message,
  });
};
