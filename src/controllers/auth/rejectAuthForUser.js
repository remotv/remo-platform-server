module.exports = (user, emitToSessionId) => {
  const { emitEvent, emitSessionEvent } = require("../../models/user");
  console.log("Reject Auth For User Input: ", user, emitToSessionId);
  if (emitToSessionId) emitSessionEvent(emitToSessionId, "LOGOUT", user);
  else emitEvent(user.id, "LOGOUT", user);
};
