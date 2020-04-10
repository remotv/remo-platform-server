module.exports = (channel_id, state) => {
  if (!Array.isArray(state)) state = [state];
  const { emitEvent } = require("../channels");
  emitEvent(channel_id, "CONTROL_STATE_UPDATED", state);
};
