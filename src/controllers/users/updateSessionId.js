module.exports = async (user) => {
  const { updateSession } = require("../../models/user");
  const { makeId } = require("../../modules/utilities");
  user.session = `ssin-${makeId()}`;
  const update = await updateSession(user.id);
  return update;
};
