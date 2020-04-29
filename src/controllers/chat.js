module.exports.loadChat = async (chat_id) => {
  const { getRecentMessages } = require("../models/chatMessage");
  const { loadMessages } = require("../config");
  const { getChat } = require("../models/chatRoom");
  let chat = await getChat(chat_id);
  let messages = await getRecentMessages(chat_id, loadMessages);
  messages = messages.reverse();
  if (messages) {
    messages.map((message) => {
      chat.messages.push(message);
    });
  } else {
    chat.messages = [];
  }
  return chat;
};
