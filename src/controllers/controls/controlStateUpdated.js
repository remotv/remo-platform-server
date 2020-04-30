module.exports = (channel_id, state) => {
  if (!Array.isArray(state)) state = [state];
  const { emitEvent } = require("../robotChannels");
  emitEvent(channel_id, "CONTROL_STATE_UPDATED", state);
};
