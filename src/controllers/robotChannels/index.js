//Actions for robot_channels
module.exports = {
  //Channel Management
  createRobotChannel: require("./createRobotChannel"),
  deleteRobotChannel: require("./deleteRobotChannel"),
  checkName: require("./checkName"),
  emitEvent: require("./emitEvent"),
  updateChannelsOnServer: require("./updateChannelsOnServer"),
  renameChannel: require("./renameChannel"),
  setDefaultChannel: require("./setDefaultChannel"),
  ensureDefaultChannel: require("./ensureDefaultChannel"),
  checkName: require("./checkName"),

  //Robot Management
  robotChannelStatus: require("./robotChannelStatus"),
  robotChannelAuth: require("./robotChannelAuth"),

  //logging:
  log: require("./log"),
};
