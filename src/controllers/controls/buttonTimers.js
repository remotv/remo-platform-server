let buttonStore = []; //storing buttons in memmory to track timers
let buttonsToRemove = []; //buttons slated for removal for next update loop
let buttonsToUpdate = []; //state changes to be applied in next update loop
/**
 * Notes:
 * - Doing all this in memmory for first pass,
 * - v2 will make use of the database
 *
 * Todo:
 * - refactor naming to reflect state tracking, not just timers
 *
 * Button removal vs button clear:
 * - Button Removal does not send a state update to the client
 * - It assumes the source button has been deleted entirely from the controls stored in db
 */

//get all buttons w/ tacked state
module.exports.getButtonTimers = () => {
  return buttonStore;
};

//remove old buttons from state tracking when new ones have been generated for a channel
module.exports.clearControlsForChannel = (channel_id) => {
  buttonStore.map((store) => {
    if (store.channel_id === channel_id) buttonsToRemove.push(store);
  });
};

//get state of specific button
module.exports.getButtonTimer = (button_id) => {
  return buttonStore.find(({ id }) => id === button_id) || null;
};

//add or update a button timer entry
module.exports.pushButtonTimer = async (button, channel_id, authOverride) => {
  //check list for existing entry first
  let store = buttonStore.find((stored) => stored.id === button.id);
  if (store) {
    if (authOverride) store = overrideButtonState(button, channel_id);
    return store;
  } else {
    //create entry if non exists yet
    button = appendStatus(button, channel_id);
    buttonStore.push(button);
    const ignoreDisabled = { ...button, disabled: false };
    return ignoreDisabled;
  }
};

//Override disabled state and appened a timestamp to the button
const overrideButtonState = (button, channel_id) => {
  console.log("Override Button State: ", button.label);
  button = appendStatus(button, channel_id);
  buttonsToUpdate.push(button);
};

//append channel_id & other info to button to track its state
const appendStatus = (button, channel_id) => {
  const { controlStateUpdated } = require("./");
  button.timeStamp = Date.now();
  button.disabled = true; // here
  button.channel_id = channel_id;
  controlStateUpdated(channel_id, [button]);
  return button;
};

//Check for state changes to buttons & broadcast them when appropriate
module.exports.updateButtonStates = () => {
  const { controlStateUpdated } = require("./");
  let updateButtons = [];
  buttonStore.forEach((button) => {
    //If the button is set for removal, do not push to updateButtons array.
    if (checkButtonForRemoval(button)) return;

    //check for state changes in buttonsToUpdate array
    const checkUpdated = checkButtonForUpdatedState(button);
    if (checkUpdated) button = checkUpdated;

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

  buttonStore = updateButtons; //update store with new array
  buttonsToRemove = []; //clear array after removing buttons
  buttonsToUpdate = []; //clear array after updating buttons
  this.cleanupInterval(); //wait till next update loop
};

//returns true if button should be removed
const checkButtonForRemoval = (button) => {
  if (buttonsToRemove !== []) {
    const check = buttonsToRemove.find((check) => check.id === button.id);
    if (check) return true;
  }
  return false;
};

//returns true if the button's state has been overridden outside of the normal update loop
const checkButtonForUpdatedState = (button) => {
  if (buttonsToUpdate !== []) {
    return buttonsToUpdate.find((check) => check.id === button.id);
  }
  return null;
};

//clears button state & sends a websocket event to the client
const clearButton = (button) => {
  const { controlStateUpdated } = require("./");
  button.disabled = false;
  button.count = button.cooldown;
  controlStateUpdated(button.channel_id, [button]);
};

//cleanup interval callback
module.exports.cleanupInterval = () => {
  const { controlStateUpdateInterval } = require("../../config");
  setTimeout(this.updateButtonStates, controlStateUpdateInterval);
  return;
};

//initialize callback
module.exports.initButtonTimerCleanup = () => {
  this.cleanupInterval();
};
