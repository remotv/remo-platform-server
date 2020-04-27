const { log } = require("./");

module.exports.createRobotAuth = async (robot_id) => {
  const { createAuthToken } = require("../../models/user");
  const { getRobotChannelById } = require("../../models/robotChannels");
  try {
    if (!robot_id) return { error: "robot_channel.id required." };
    log(`Getting key for robot_channel: ${robot_id}`);
    const getRobot = await getRobotChannelById(robot_id);
    const key = await createAuthToken(getRobot);
    return { key: key };
  } catch (err) {
    console.log(err);
    return { error: "Unable to generate key." };
  }
};

module.exports.extractRobotToken = async (token) => {
  const { extractToken } = require("../../models/user");
  return await extractToken(token);
};

//used by WS for auth
module.exports.authRobot = async (token) => {
  const { verifyRobotTokenData } = require("../../models/robotChannels");
  const auth = await this.extractRobotToken(token);
  // console.log("Extracting Robot Token: ", auth);
  const robot = await verifyRobotTokenData(auth);
  return robot;
};

//used by API for auth
module.exports.authRobotData = async (tokenData) => {
  const { verifyRobotTokenData } = require("../../models/robotChannels");
  const auth = await verifyRobotTokenData(tokenData);
  return auth;
};
