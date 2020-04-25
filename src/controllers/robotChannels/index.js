//Actions for robot_channels
module.exports = {
  //Channel Management
  createRobotChannel: require("./createRobotChannel"),
  deleteRobotChannel: require("./deleteRobotChannel"),
  checkName: require("./checkName"), //validate channel name, check for dupes
  emitEvent: require("./emitEvent"), //emit websocket event for channel
  updateChannelsOnServer: require("./updateChannelsOnServer"), //updates server with recent channel list
  renameChannel: require("./renameChannel"),
  setDefaultChannel: require("./setDefaultChannel"),
  ensureDefaultChannel: require("./ensureDefaultChannel"),

  //Robot Management
  robotChannelStatus: require("./robotChannelStatus"),
  robotChannelAuth: require("./robotChannelAuth"),

  //logging:
  log: require("./log"),
};
