/**
 * Robot Channels:
 *  Formerly used to be channels, and robots, but now they are a single object
 *  unique parameters:
 *  @param {string} name : name of channel
 *  @param {string} id : unique id
 *  @param {string} type : "robot_channel"
 *  @param {int} created : timestamp when channel was created, in millis
 *  @param {int} heartbeat : timestamp of when robot was last online, in millis
 *
 *  reference IDs:
 *  @param {string} server_id : server this channel is contained within
 *  @param {string} owner_id : owner of the robot / channel
 *  @param {string} chat_id : chat displayed for channel
 *  @param {string} controls_id : controls displayed on channel
 *
 *  TBD: Not added yet
 *  @param {string} secret_key unique user defined string, basically a password
 */

module.exports = {
  //channel specific stuff
  saveRobotChannel: require("./saveRobotChannel"),
  getRobotChannelsForServer: require("./getRobotChannelsForServer"),
  deleteRobotChannel: require("./deleteRobotChannel"),
  updateRobotChannelName: require("./updateRobotChannelName"),
  updateRobotChannelControls: require("./updateControlsId"),
  getRobotChannelById: require("./getRobotChannelById"),

  //robot specific stuff
  verifyRobotTokenData: require("./verifyRobotTokenData"),
  updateHeartbeat: require("./updateHeartbeat"),
  updateSecretKey: "",

  //Interal use only:
  getAllRobotChannels: require("./getAllRobotChannels"),
  getAllChannelsCount: require("./getAllChannelsCount"),

  getTotalRobotChannelCount: "",
  log: require("./log"),
};
