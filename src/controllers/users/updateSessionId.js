module.exports = async (user) => {
  const { updateSessionId } = require("../../models/user");
  const { makeId } = require("../../modules/utilities");
  const { log } = require(".");
  try {
    log(`Updating User Session ID: ${user.username}`);
    user.session_id = `ssin-${makeId()}`;
    const update = await updateSessionId(user);
    return update;
  } catch (err) {
    log(err.message);
  }
};
