const { createRobotMessage } = require("../models/chatMessage");
const { getChat } = require("../models/chatRoom");
const { getRobotChannelById } = require("../models/robotChannels");
module.exports = async (ws, message) => {
  if (ws.robot) {
    const chat = await getChat(message.chatId);
    if (!chat || chat.host_id !== ws.robot.server_id) {
      return console.log(
        `${ws.robot.id} attempted to send message to non existant or other servers chat ${message.chatId}`
      );
    }
    message.robot = ws.robot;
    message.type = "robot";
    const getName = await getRobotChannelById(ws.robot.id);
    message.robot.name = getName.name;
    createRobotMessage(message);
  } else {
    console.log("Robot Message Rejected (not authed): ", message);
  }
};
