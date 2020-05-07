module.exports = (message) => {
  const { logger } = require("../../modules/logging");
  logger({
    level: "debug",
    source: "/controllers/users",
    message: message,
  });
};
