module.exports = (message) => {
  logger({
    level: "debug",
    source: "/controllers/auth",
    message: message,
  });
};
