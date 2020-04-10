module.exports = (channel_id, state) => {
  const { emitEvent } = require("../channels");
  emitEvent(channel_id, "CONTROL_STATE_UPDATED", state);
};
