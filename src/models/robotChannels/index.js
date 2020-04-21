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
  saveRobotChannel: require("./saveRobotChannel"),
  getRobotChannelsForServer: "",
  deleteRobotChannel: "",
  updateRobotChannelName: "",
  updateRobotChannelControls: "",
  getRobotChannelById: "",
  verifyRobotChannelAuth: "",
  updateHeartbeat: "",
  updateSecretKey: "",

  //Interal use only:
  getAllRobotChannels: "",
  getTotalRobotChannelCount: "",
  log: require("./log"),
};
