module.exports = () => {
  const {
    robotStatus,
  } = require("../controllers/robotChannels/robotChannelStatus");
  const { syncPatreonData } = require("../controllers/patreon");
  const { initActiveServers } = require("../models/robotServer");
  const { initActiveChats } = require("../models/chatRoom");
  const {
    initButtonTimerCleanup,
  } = require("../controllers/controls/buttonTimers");

  //setup anything that requires globalScope:
  setGlobals();

  //start intervals
  robotStatus();
  syncPatreonData();
  initButtonTimerCleanup();

  //Initalize Active Servers:
  //This is used for storing active users on a server
  initActiveServers();
  initActiveChats();
};

const setGlobals = () => {
  Array.prototype.remove = function () {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };
};
