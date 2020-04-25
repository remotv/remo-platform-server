module.exports = (channel_id, event, data) => {
  const wss = require("../../services/wss");
  wss.clients.forEach((ws) => {
    if (ws.channel_id === channel_id) {
      ws.emitEvent(event, data);
    }
  });
};
