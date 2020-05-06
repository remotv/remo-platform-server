module.exports = async (user) => {
  const { updateSession } = require("../../models/user");
  const { makeId } = require("../../modules/utilities");
  const { log } = require("./");
  log(`Updating User Session ID: ${user.username}`);
  user.session = `ssin-${makeId()}`;
  const update = await updateSession(user.id);
  return update;
};
