let buttonStore = [];

//Doing all this in memmory for a first pass. Will use DB on v2
module.exports.getButtonTimers = () => {
  return buttonStore;
};

module.exports.getButtonTimer = async button_id => {
  console.log(buttonStore, button_id);
  return (await buttonStore.find(({ id }) => id === button_id)) || null;
};

module.exports.pushButtonTimer = button => {
  console.log("cooldown button: ", button);
  if (buttonStore.some(stored => stored.id === button.id)) {
    console.log("Found Button Entry to update: ", button.label);
    //  let upateButtons = [];
    buttonStore.forEach(store => {
      if (
        button.id === store.id &&
        store.timeStamp <= store.cooldown * 1000 + Date.now()
      ) {
        store.timeStamp = Date.now();
        //send timer event?
      }
    });
  } else {
    //push entry
    console.log("No entry found, updating button");
    button.timeStamp = Date.now();
    buttonStore.push(button);
    //send timer event?
  }
};

module.exports.cleanupButtonTimers = () => {
  let updateButtons = [];
  buttonStore.forEach(button => {
    console.log("Active Button Timer: ", button);
    const expire = button.cooldown * 1000 + button.timeStamp;
    const dif = (Date.now() - expire) / 1000;
    if (dif < 0) updateButtons.push(button);
  });
  buttonStore = updateButtons;
  this.cleanupInterval();
};

module.exports.cleanupInterval = () => {
  const { createSimpleTimer } = require("../../modules/utilities");
  const { cleanupButtonTimersInterval } = require("../../config");
  console.log("Cleanup Interval : ", cleanupButtonTimersInterval);
  createSimpleTimer(cleanupButtonTimersInterval, this.cleanupButtonTimers);
  return;
};

module.exports.initButtonTimerCleanup = () => {
  this.cleanupInterval();
};
