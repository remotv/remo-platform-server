/**
 * Robot Channels:
 *  unique parameters:
 *  @param {string} name : name of channel
 *  @param {string} id : unique id
 *  @param {string} type : "robot_channel"
 *  @param {int} created : timestamp when channel was created, in millis
 *  @param {int} heartbeat : timestamp of when robot was last online, in millis
 *
 *  reference IDs:
 *  @param {string} server_id server this channel is contained within
 *  @param {string} owner_id owner of the robot / channel
 *  @param {string} chat_id chat displayed for channel
 *  @param {string} controls_id controls displayed on channel
 *
 */

module.exports = {
  saveRobotChannel: require("./saveRobotChannel"),
  log: require("./log"),
};
