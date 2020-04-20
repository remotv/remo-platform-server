/**
 * Get All Robots
 * Get All Channels
 * Map robots that are paired with channels
 * Replace those channels with the robot
 * All other robots become their own channels
 * All remaining channels also become robots
 * GUI no longer distinguishes between channels and robots
 */
const dontSave = true;
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
          //  console.log("Combine", `${robot.name} + ${channel.name}`);
          robot.channel_info = channel;
          robotFound = true;
          return;
        }
      });
      if (!robotFound) channelsWithNoRobot.push(channel);
    });

    await Promise.all([checkRobots, checkChannels]);
    console.log("Done waiting for robots and channels");
    const robotChannels = async () => {
      return await buildRobotChannels(
        robotsWithLinkedChannels,
        robotsWithNoChannels,
        channelsWithNoRobot
      );
    };

    await robotChannels()
      .then((robot_channels) => {
        console.log(
          "Robots With Linked Channels: ",
          robotsWithLinkedChannels.length,
          "\n",
          "Robots without a Linked Channels: ",
          robotsWithNoChannels.length,
          "\n",
          "Channels without Linked Robots: ",
          channelsWithNoRobot.length,
          "\n",
          "Robot Channels Generated: ",
          robot_channels.length
        );

        return robot_channels;
      })
      .then(async (robot_channels) => {
        await saveChannels(robot_channels);
      })
      .then(() => end());
  } catch (err) {
    console.log(err);
  }
};

const end = () => {
  console.log("/////// PROCESSING COMPLETE //////////");
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

const saveChannels = async (saveChannels) => {
  const { saveRobotChannel } = require("../models/robotChannels");
  console.log("Saving Channels...");
  return await Promise.all(
    saveChannels.map(async (channel) => saveRobotChannel(channel))
  );
};

buildRobotChannels = async (linkedRobots, unlinkedRobots, unlinkedChannels) => {
  const { getChatRooms } = require("../models/chatRoom");
  const { createControls } = require("../models/controls");
  let robotChannels = [];
  let ignoreMe = 0;
  let ignoredChannels = 0;

  console.log("Combine Linked Robots ...");

  const combineLinkedRobot = async (robot) => {
    console.log("Linked Robot Check: ", robot.name);
    const update = await makeRobotChannel({
      name: robot.name,
      id: robot.id,
      server_id: robot.host_id,
      owner_id: robot.owner_id,
      chat_id: robot.channel_info.chat,
      created: robot.created,
      controls: robot.channel_info.controls,
      heartbeat: robot.heartbeat,
    });
    robotChannels.push(update);
    return update;
  };

  getChannelsFromLinkedRobots = async () => {
    return await Promise.all(
      linkedRobots.map(async (robot) => await combineLinkedRobot(robot))
    );
  };

  convertUnlinkedRobot = async (robot) => {
    if (!robot.host_id) {
      console.log("Ignoring Robot ...");
      ignoreMe += 1;
    } else {
      console.log("Robot Host ID Check: \n", robot.host_id);
      const getChatId = await getChatRooms(robot.host_id);
      console.log("Get Chat for Channel: ", getChatId);
      console.log("Generating Controls...");
      const controls = await createControls({
        channel_id: robot.id,
        dont_save: dontSave,
      });
      const convert = makeRobotChannel({
        name: robot.name,
        id: robot.id,
        server_id: robot.host_id,
        owner_id: robot.owner_id,
        chat_id: getChatId[0].id,
        created: robot.created,
        controls: controls.id,
        heartbeat: robot.heartbeat,
      });
      robotChannels.push(convert);
      return convert;
    }
  };

  getChannelsFromConvertedRobots = async () => {
    return await Promise.all(
      unlinkedRobots.map(async (robot) => {
        await convertUnlinkedRobot(robot);
      })
    );
  };

  const convertUnlinkedChannel = async (channel) => {
    const { getRobotServer } = require("../models/robotServer");
    try {
      const info = await getRobotServer(channel.host_id);
      if (info && info.owner_id) {
        const owner = info.owner_id;
        console.log("Finding Owner: ", owner);
        //find server owner:

        const convert = makeRobotChannel({
          name: channel.name,
          server_id: channel.host_id,
          owner_id: owner,
          chat_id: channel.chat,
        });
        robotChannels.push(convert);
      } else {
        ignoredChannels += 1;
        console.log("unable to get owner for server, skipping");
        console.log(info);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getConvertedUnlinkedChannels = async () => {
    return await Promise.all(
      await unlinkedChannels.map(
        async (channel) => await convertUnlinkedChannel(channel)
      )
    );
  };

  console.log("Convert Linked Robots ...");
  await getChannelsFromLinkedRobots();
  console.log("Convert Unlinked Robots ...");
  await getChannelsFromConvertedRobots();
  console.log("Convert Unlinked Channels ...");
  await getConvertedUnlinkedChannels();

  console.log(
    `Done building robot channels, ${ignoreMe} robots and ${ignoredChannels} channels were ignored...`
  );
  return robotChannels;
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
    secret_key: null,
  };
};

run().then(() => {
  console.log("The end?");
});
