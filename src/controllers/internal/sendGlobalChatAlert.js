module.exports = (alert) => {
  const { makeId, createTimeStamp } = require("../../modules/utilities");
  const wss = require("../../services/wss");
  const alertMessage = {
    sender: "System Alert",
    type: "alert",
    broadcast: "",
    display_message: true,
    id: `mesg-${makeId()}`,
    time_stamp: createTimeStamp(),
    message: alert.message || alert,
  };

  console.log("Send Global Message: ", alertMessage);
  wss.clients.forEach((client) => {
    client.emitEvent("MESSAGE_RECEIVED", alertMessage);
  });
};
