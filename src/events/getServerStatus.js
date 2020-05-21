module.exports = async (ws, data) => {
  const { logLevel } = require("../config/index");
  if (logLevel === "debug") console.log("GET LOCAL STATUS ", data, ws.user);

  //Not used by robot
  const {
    sendRobotServerStatus,
    getRobotServer,
  } = require("../models/robotServer");
  const { server_id } = data;

  const getServer = await getRobotServer(server_id);
  sendRobotServerStatus(server_id, getServer.status);
};
