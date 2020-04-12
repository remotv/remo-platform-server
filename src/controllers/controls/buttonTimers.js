let buttonStore = [];

//Doing all this in memmory for a first pass. Will use DB on v2

//get all the recent button timer entries
module.exports.getButtonTimers = () => {
  return buttonStore;
};

//get specific button timer entry by button_id
module.exports.getButtonTimer = async button_id => {
  console.log(buttonStore, button_id);
  return buttonStore.find(({ id }) => id === button_id) || null;
};

//add or update a button timer entry
module.exports.pushButtonTimer = async (button, channel_id) => {
  //check list for existing entry first
  let store = buttonStore.find(stored => stored.id === button.id);
  //console.log("store: ", store);
  if (store) {
    return store;
  } else {
    //create entry if non exists yet
    button = appendStatus(button, channel_id);
    buttonStore.push(button);
    const ignoreDisabled = { ...button, disabled: false };
    return ignoreDisabled;
  }
};

//add info to buttons w/ timers
const appendStatus = (button, channel_id) => {
  const { controlStateUpdated } = require("./");
  button.timeStamp = Date.now();
  button.disabled = true; // here
  button.channel_id = channel_id;
  controlStateUpdated(channel_id, [button]);
  return button;
};

//periodically look for expired button timer entries to remove
module.exports.cleanupButtonTimers = () => {
  const { controlStateUpdated } = require("./");
  let updateButtons = [];
  buttonStore.forEach(button => {
    // console.log("Active Button Timer: ", button);
    const prevCount = button.count || button.cooldown;
    const expire = button.timeStamp + button.cooldown * 1000;
    const count = Math.round(button.cooldown - (expire - Date.now()) / 1000);
    if (count < button.cooldown) {
      button.count = count;
      updateButtons.push(button);
      if (count !== prevCount) controlStateUpdated(button.channel_id, [button]);
    } else {
      //timer complete!
      clearButton(button);
    }
  });
  buttonStore = updateButtons;
  this.cleanupInterval();
};

const clearButton = button => {
  const { controlStateUpdated } = require("./");
  button.disabled = false;
  button.count = button.cooldown;
  controlStateUpdated(button.channel_id, [button]);
};

//cleanup interval callback
module.exports.cleanupInterval = () => {
  const { controlStateUpdateInterval } = require("../../config");
  // console.log("Cleanup Interval : ", cleanupButtonTimersInterval);
  //createSimpleTimer(controlStateUpdateInterval, this.cleanupButtonTimers);
  setTimeout(this.cleanupButtonTimers, controlStateUpdateInterval);
  return;
};

//initialize callback
module.exports.initButtonTimerCleanup = () => {
  this.cleanupInterval();
};
