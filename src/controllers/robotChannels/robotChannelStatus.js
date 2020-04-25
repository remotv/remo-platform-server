/**
 * Refactoring from: /controllers/robots.js
 * - Manage live-satus of robot_channels
 *
 * todo:
 * - update robot / channel references to robot_channel
 * - Live status check should depend on robot.heartbeat, not server.status.live_devices
 */

let robots = []; //currently live robots in memmory
let prevBots = []; //store previous bots to compare data against

const { logger } = require("../../modules/logging");
const log = (message) => {
  logger({
    message: message,
    level: "debug",
    source: "controllers/robotChannels/robotChannelStatus.js",
  });
};

//gets called by /src/scripts/init.js
module.exports.robotStatus = async () => {
  const { updateRobotServer } = require("../../models/robotServer");
  const { checkForLiveRobots } = require("../robotServer");
  prevBots = robots;
  robots = await getLiveRobots();
  await updateRobotStatus(robots);
  await checkForLiveRobots();
  updateRobotServer(); //only send update event on changes
  announceRecentlyLive();
  checkInterval();
};

//checks for recent changes in live robots for triggering notifications
const announceRecentlyLive = async () => {
  const { liveRobotAlert } = require("./notifications/index");
  robots.forEach((robot) => {
    let found = false;
    prevBots.forEach((prevBot) => {
      if (robot.id === prevBot.id) found = true;
    });
    if (found === false) liveRobotAlert(robot);
  });
};

//update robot_channel heartbeat
module.exports.updateChannelStatus = async ({ name, id }) => {
  const { updateHeartBeat } = require("../../models/robotChannels");
  log(`Update current channel for robot: ${name}, ${id}`);
  updateHeartBeat(id);
};

//look for live robots connected via websockets
const getLiveRobots = async () => {
  wss = require("../services/wss");
  let checkRobots = [];
  await wss.clients.forEach(async (ws) => {
    if (ws.robot) {
      //No dupes!
      if (!checkRobots.some((robot) => robot.id === ws.robot.id)) {
        checkRobots.push(ws.robot);
      }
    }
  });
  // console.log("CHECK ROBOTS CHECK: ", checkRobots.length);
  return checkRobots;
};

const checkInterval = async () => {
  const { liveStatusInterval } = require("../config");
  setTimeout(this.robotStatus, liveStatusInterval);
  return;
};

const updateRobotStatus = async (robotsToUpdate) => {
  await robotsToUpdate.forEach(async (robot) => {
    await this.updateChannelStatus(robot);
  });
  return;
};

const getLiveRobotList = () => {
  return robots;
};
