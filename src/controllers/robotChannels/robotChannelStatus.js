/**
 * Refactoring from: /controllers/robots.js
 * Robot Channel State Management:
 * - Gets live-status updates from active robots
 * - Sends updated status to clients
 *
 * todo:
 * - update robot / channel references to robot_channel
 * - Live status check should depend on robot.heartbeat, not server.status.live_devices
 */

let robots = [];
let prevBots = [];
const { logger } = require("../../modules/logging");
const log = (message) => {
  logger({
    message: message,
    level: "debug",
    source: "controllers/robot.js",
  });
};

module.exports.robotStatus = async () => {
  const { updateRobotServer } = require("../../models/robotServer");
  prevBots = robots;
  robots = await getLiveRobots(); //get robots from wss connection
  await updateRobotStatus(robots); //update robot heartbeat for all live robots
  await this.checkForLiveRobotsOnServer(); //checking...
  updateRobotServer(); //only send update event on changes
  announceRecentlyLive();
  checkInterval();
};

const announceRecentlyLive = async () => {
  const { liveRobotAlert } = require("../notifications");
  robots.forEach((robot) => {
    let found = false;
    prevBots.forEach((prevBot) => {
      if (robot.id === prevBot.id) found = true;
    });
    if (found === false) liveRobotAlert(robot);
  });
};

module.exports.updateChannelStatus = async ({ robot, channel_id }) => {
  const { updateRobotStatus } = require("../../models/robot");
  log(`Update current channel for robot: ${robot.name}, ${channel_id}`);
  robot.status.current_channel = channel_id;
  updateRobotStatus(robot.id, robot.status);
};

//check wss connections for live robots
const getLiveRobots = async () => {
  wss = require("../../services/wss");
  let checkRobots = [];
  await wss.clients.forEach(async (ws) => {
    if (ws.robot) {
      //No dupes!
      if (!checkRobots.some((robot) => robot.id === ws.robot.id)) {
        console.log("UPDATING ROBOT STATUS: ", robot);
        checkRobots.push(ws.robot);
      }
    }
  });
  // console.log("CHECK ROBOTS CHECK: ", checkRobots.length);
  return checkRobots;
};

const checkInterval = async () => {
  const { liveStatusInterval } = require("../../config");
  setTimeout(this.robotStatus, liveStatusInterval);
  return;
};

//update heartbeat for all live robots
const updateRobotStatus = async (robotsToUpdate) => {
  const { updateHeartbeat } = require("../../models/robot");
  await robotsToUpdate.forEach(async (robot) => {
    log(`Robot, ${robot}, Status: ${robot.status}`);
    await updateHeartbeat(robot.id);
  });
  return;
};

const getLiveRobotList = () => {
  return robots;
};

//live robots are saved to a list stored on robot_server object currently
module.exports.checkForLiveRobotsOnServer = async () => {
  const { getRobotServers } = require("../../models/robotServer");
  const servers = await getRobotServers();
  console.log("GETTING ACTIVE ROBOTS ON SERVER... ");
  await servers.forEach(async (server) => {
    await this.pushActiveRobotsToServer(server);
  });
};

//push currently active robots for a server to server.status.liveDevices;
module.exports.pushActiveRobotsToServer = async (server) => {
  const { getAllRobotChannels } = require("../../models/robotChannels");
  const { createTimeStamp } = require("../../modules/utilities");
  const { liveStatusInterval } = require("../../config");
  const { updateRobotServerStatus } = require("../../models/robotServer");
  const robotChannels = await getAllRobotChannels(server.server_id);
  let liveDevices = [];
  const checkTimeStamp = createTimeStamp() - liveStatusInterval * 1.25;
  if (!robotChannels || (robotChannels && robotChannels.error)) return;
  robotChannels.map((robot) => {
    if (robot.heartbeat && robot.heartbeat >= checkTimeStamp) {
      liveDevices.push(robot);
      console.log("Pushing live robot to server: ", robot.name);
    }
  });
  server.status.liveDevices = liveDevices;
  await updateRobotServerStatus(server.server_id, server.status);
};
