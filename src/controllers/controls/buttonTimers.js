let buttonStore = [];
let buttonsToRemove = [];

/**
 * Notes:
 * - Doing all this in memmory for first pass,
 * - v2 will make use of the database
 *
 * Button removal vs button clear:
 * - Button Removal does not send a state update to the client
 * - It assumes the source button has been deleted entirely from the controls stored in db
 */

//get all the recent button timer entries
module.exports.getButtonTimers = () => {
  return buttonStore;
};

//called when new controls are generated
module.exports.clearControlsForChannel = (channel_id) => {
  buttonStore.map((store) => {
    if (store.channel_id === channel_id) buttonsToRemove.push(store);
  });
};

//get specific button timer entry by button_id
module.exports.getButtonTimer = (button_id) => {
  //console.log(buttonStore, button_id);
  return buttonStore.find(({ id }) => id === button_id) || null;
};

//add or update a button timer entry
module.exports.pushButtonTimer = async (button, channel_id) => {
  //check list for existing entry first
  let store = buttonStore.find((stored) => stored.id === button.id);
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
  buttonStore.forEach((button) => {
    //If the button is set for removal, return.
    if (checkButtonForRemoval(button)) return;
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
  buttonsToRemove = []; //clear the array
  this.cleanupInterval();
};

const checkButtonForRemoval = (button) => {
  if (buttonsToRemove !== []) {
    const check = buttonsToRemove.find((check) => check.id === button.id);
    if (check) return true;
  }
  false;
};

const clearButton = (button) => {
  const { controlStateUpdated } = require("./");
  button.disabled = false;
  button.count = button.cooldown;
  controlStateUpdated(button.channel_id, [button]);
};

//cleanup interval callback
module.exports.cleanupInterval = () => {
  const { controlStateUpdateInterval } = require("../../config");
  setTimeout(this.cleanupButtonTimers, controlStateUpdateInterval);
  return;
};

//initialize callback
module.exports.initButtonTimerCleanup = () => {
  this.cleanupInterval();
};
