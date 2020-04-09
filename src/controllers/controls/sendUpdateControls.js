module.exports = channel_id => {
  const { emitEvent } = require("../channels");
  emitEvent(channel_id, "CONTROLS_UPDATED");
};
