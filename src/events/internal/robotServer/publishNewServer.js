module.exports = (server, user) => {
  const wss = require("../../../services/wss");
  try {
    wss.emitInternalEvent("NEW_ROBOT_SERVER", {
      server: server,
      user: user,
    });
  } catch (err) {
    console.log(
      "events/internal/robotServer/publishNewServer.js ",
      "THERE WAS A PROBLEM PUBLISHING NEW SERVER EVENT",
      err
    );
  }
};
