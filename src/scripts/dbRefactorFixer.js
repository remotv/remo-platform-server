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
      "Total Channels: ",
      channels.length
    );

    const checkRobots = await robots.map(async (robot) => {
      if (robot.status && robot.status.current_channel) {
        robotsWithLinkedChannels.push(robot);
      } else robotsWithNoChannels.push(robot);
    });

    const checkChannels = await channels.map(async (channel) => {
      robotsWithLinkedChannels.map((robot) => {
        if (robot.status.current_channel === channel.id) {
          console.log("Combine");
        } else {
          channelsWithNoRobot.push(channel);
        }
      });
    });

    await Promise.all(checkRobots, checkChannels);
    console.log(
      "Robots With Linked Channels: ",
      robotsWithLinkedChannels.length,
      "Robots without a Linked Channels: ",
      robotsWithNoChannels.length,
      "Channels without Linked Robots: ",
      channelsWithNoRobot.length
    );
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

run();
