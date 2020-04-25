module.exports.createRobotAuth = (robot_id) => {
  const { createAuthToken } = require("../../models/user");
  return createAuthToken({ id: robot_id });
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
