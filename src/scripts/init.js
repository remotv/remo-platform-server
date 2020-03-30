module.exports = () => {
  const { robotStatus } = require("../controllers/robots");
  const { syncPatreonData } = require("../controllers/patreon");
  const { initActiveServers } = require("../models/robotServer");
  const { initActiveChats } = require("../models/chatRoom");
  const {
    initButtonTimerCleanup
  } = require("../controllers/controls/buttonTimers");

  robotStatus();
  syncPatreonData();
  initButtonTimerCleanup();

  //Initalize Active Servers:
  //This is used for storing active users on a server
  initActiveServers();
  initActiveChats();
};
