/**
 * Robot Server & Channel State Management: Does not include controls or chat
 * - tracks ws connections from live robot_channels for state management
 * - Updates heartbeats for active robots
 * - Checks channels for every server for updated heartbeats
 * - Pushes active channels to server.status.liveDevices,
 * - Broadcasts global event w/ updated server information,
 */

let robots = []; //store list of robots in memmory
let prevBots = []; //store list of previous updated robots to compare for changes

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
  await pushLiveDevicesToServers();
  updateRobotServer(); //broadcast event for updated servers
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

//check wss connections for live robots
const getLiveRobots = async () => {
  wss = require("../../services/wss");
  let checkRobots = [];
  await wss.clients.forEach(async (ws) => {
    if (ws.robot) {
      //No dupes!
      if (!checkRobots.some((robot) => robot.id === ws.robot.id)) {
        // console.log("UPDATING ROBOT STATUS: ", ws.robot);
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
  const { updateHeartbeat } = require("../../models/robotChannels");
  await robotsToUpdate.forEach(async (robot) => {
    console.log("ROBOT: ", robot.name, robot.server_id);
    await updateHeartbeat(robot.id);
  });
  return;
};

/**
 * - Checks every channel on each server for updated heartbeat
 * - Pushes changes from live robot_channels to server.status.liveDevices
 */
const pushLiveDevicesToServers = async () => {
  const { getRobotServers } = require("../../models/robotServer");
  const { getRobotChannelsForServer } = require("../../models/robotChannels");
  const { liveStatusInterval } = require("../../config");
  const { updateRobotServerStatus } = require("../../models/robotServer");
  const servers = await getRobotServers();
  log("Check Servers for Updates: ", servers.length);
  const compareDate = new Date();
  await servers.forEach(async (server) => {
    let liveDevices = [];
    const channels = await getRobotChannelsForServer(
      server.server_id || server.id
    );
    channels.forEach((channel) => {
      if (channel.heartbeat >= compareDate - liveStatusInterval * 1.25) {
        log("Pushing Live Device to Server: ", channel.name);
        liveDevices.push(channel);
        return;
      }
    });

    //Update Server only if there are changes.
    if (
      JSON.stringify(liveDevices) !== JSON.stringify(server.status.liveDevices)
    ) {
      log(`Update This Server: ${server.server_name || server.name}`);
      server.status.liveDevices = liveDevices;
      updateRobotServerStatus(server.server_id || server.id, server.status);
    }
    return;
  });
  return;
};

const getLiveRobotList = () => {
  return robots;
};
