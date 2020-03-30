//status manager for controls

module.exports.getStatusForControls = async buttons => {
  let appendStatus = [];
  if (buttons) {
    const getStatus = async button => {
      return await this.getButtonStatus(button);
    };
    appendStatus = await Promise.all(buttons.map(button => getStatus(button)));
    console.log("Status Check: ", appendStatus);
    return appendStatus;
  }
  console.log("Input required for getStatusForControls()");
  return null;
};

module.exports.getButtonStatus = async button => {
  const { getButtonTimer } = require("./buttonTimers");
  console.log("Check Button Status: ", button);
  let check = null;
  if (button.cooldown) check = await getButtonTimer(button.id);
  if (check) return check;
  else return button;
};
