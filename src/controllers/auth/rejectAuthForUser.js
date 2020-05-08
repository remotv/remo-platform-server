module.exports = (user, emitToSessionId) => {
  const { emitEvent, emitSessionEvent } = require("../../models/user");
  console.log("Reject Auth For User Input: ", user, emitToSessionId);
  if (emitToSessionId) emitSessionEvent(emitToSessionId, "LOGOUT", user);
  else {
    //setting session_id to null to flag client & prevent race condition
    user.session_id = null;
    emitEvent(user.id, "LOGOUT", user);
  }
};
