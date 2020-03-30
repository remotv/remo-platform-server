//Route all button status requests and updates through here.
module.exports = async button => {
  const { getButtonTimer } = require("./buttonTimers");

  if (button.cooldown) {
    return await getButtonTimer(button.id);
  }
  return null;
};
