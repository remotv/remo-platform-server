let buttonStore = [];

module.exports = () => {
  return buttonStore;
};

module.exports.pushButton = button => {
  if (buttonStore.some(stored => stored.id === button.id)) {
    console.log("Found Button Entry to update: ", button.label);
    buttonStore.forEach(store => {
      if (
        button.id === store.id &&
        store.timeStamp <= store.cooldown * 1000 + Date.now()
      ) {
        store.timeStamp = Date.now();
      }
    });
  } else {
    //push entry
    console.log("No entry found, updating button");
    button.timeStamp = Date.now();
    buttonStore.push(button);
  }
};

module.exports.cleanupButtonStore = () => {
  let updateButtons = [];
  console.log(
    "Cleaning up buttonstore, starting entries: ",
    buttonStore.length
  );
  buttonStore.forEach(button => {
    if (button.timeStamp <= button.cooldown * 1000 + Date.now()) {
      updateButtons.push(button);
    }
  });
  buttonStore = updateButtons;
  console.log("Cleanup buttonCtore complete, result: ", buttonStore.length);
  this.cleanupInterval();
};

module.exports.cleanupInterval = () => {
  const { createSimpleTimer } = require("../../../modules/utilities");
  const { cleanButtonTimers } = require("../../../config");
  createSimpleTimer(cleanButtonTimers, this.cleanButtonTimers);
  return;
};
