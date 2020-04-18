/**
 * Get All Robots
 * Get All Channels
 * Map robots that are paired with channels
 * Replace those channels with the robot
 * All other robots become their own channels
 * All remaining channels also become robots
 * GUI no longer distinguishes between channels and robots
 */

const run = async () => {
  const { getAllChannels } = require("../models/channel");
  try {
    let robotsWithLinkedChannels = [];
    let robotsWithNoChannels = [];
    let channelsWithNoRobot = [];

    const robots = await getAllRobots();
    const channels = await getAllChannels();

    console.log(
      "Total Robots: ",
      robots.length,
      "\n",
      "Total Channels: ",
      channels.length
    );

    const checkRobots = await robots.map(async (robot) => {
      if (robot.status && robot.status.current_channel) {
        robotsWithLinkedChannels.push(robot);
      } else robotsWithNoChannels.push(robot);
    });

    const checkChannels = await channels.map(async (channel) => {
      let robotFound = false;
      robotsWithLinkedChannels.map((robot) => {
        if (robot.status.current_channel === channel.id) {
          console.log("Combine", `${robot.name} + ${channel.name}`);
          robot.channel_info = channel;
          robotFound = true;
          return;
        }
      });
      if (!robotFound) channelsWithNoRobot.push(channel);
    });

    await Promise.all(checkRobots, checkChannels);
    console.log(
      "Robots With Linked Channels: ",
      robotsWithLinkedChannels.length,
      "\n",
      "Robots without a Linked Channels: ",
      robotsWithNoChannels.length,
      "\n",
      "Channels without Linked Robots: ",
      channelsWithNoRobot.length
    );

    await buildRobotChannels(robotsWithLinkedChannels);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const getAllRobots = async () => {
  const db = require("../services/db");
  try {
    const query = `SELECT * FROM robots`;
    const check = await db.query(query, []);
    if (check.rows[0]) return check.rows;
  } catch (err) {
    console.log(err);
  }
  return [];
};

buildRobotChannels = async (linkedRobots, unlinkedRobots, unlinkedChannels) => {
  let robotChannels = [];
  const combineLinkedRobots = linkedRobots.map((robot) => {
    const combine = makeRobotChannel({
      name: robot.name,
      id: robot.id,
      server_id: robot.host_id,
      owner_id: robot.owner_id,
      chat_id: robot.channel_info.chat,
      created: robot.created,
      controls: robot.channel_info.controls,
      heartbeat: robot.heartbeat,
    });
    console.log(combine);
    robotChannels.push(combine);
  });

  await Promise.all(combineLinkedRobots);
};

makeRobotChannel = ({
  name,
  id,
  server_id,
  owner_id,
  chat_id,
  created,
  controls,
  heartbeat,
}) => {
  const { makeId } = require("../modules/utilities");
  return {
    name: name || "",
    id: id || `rbot-${makeId()}`,
    type: "robot_channel",
    server_id: server_id,
    owner_id: owner_id || "",
    chat_id: chat_id || "",
    created: created || Date.now(),
    controls: controls || "",
    heartbeat: heartbeat || 0,
  };
};

run();
