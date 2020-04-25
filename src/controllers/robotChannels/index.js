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

  //Robot Management
  robotChannelAuth: require("./robotChannelAuth"),
  updateHeartbeat: "",

  //Internal Use Only:
  updateLiveRobotStatus: "",

  //logging:
  log: "",
};
