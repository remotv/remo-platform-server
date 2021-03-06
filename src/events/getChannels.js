const { SEND_ROBOT_SERVER_INFO } = require("./definitions");
const { getRobotChannelsForServer } = require("../models/robotChannels");
const { sendActiveUsers } = require("../models/user");
const { getInvitesForServer } = require("../models/invites");

//CAN DEPRECATE, doesn't sound like it will break robots
module.exports = async (ws, data) => {
  // console.log("GET CHAT ROOMS: ", data);
  ws.server_id = data.server_id;

  const sendInfo = {
    channels: await getRobotChannelsForServer(data.server_id),
    users: await sendActiveUsers(data.server_id),
    invites: await getInvitesForServer(data.server_id),
  };

  // ws.user[data.server_id] = sendInfo.invites;
  // console.log(ws.user);
  ws.emitEvent(SEND_ROBOT_SERVER_INFO, sendInfo);
};
