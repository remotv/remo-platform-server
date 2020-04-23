/**
 * Done: - Get All Robots
 * Done: - Get All Channels
 * Done: - Map robots that are paired with channels
 * Done: - Replace those channels with the robot
 * Done: - All robots without a linked channel will be removed
 * Done: - All remaining channels also become robots
 * Done: - Ensure there is still a default channel
 *
 * Todo:
 * - Handle servers w/ no channels to update
 * - GUI no longer distinguishes between channels and robots
 */

let execute = false; //ONLY SET THIS TO FALSE WHEN READY TO GO!
let serversWithNoDefaultChannels = 0;
let robotsWithLinkedChannels = [];
let robotsWithNoChannels = [];
let channelsWithNoRobot = [];

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const run = async () => {
  const { getAllChannels } = require("../models/channel");
  const { getRobotServers } = require("../models/robotServer");

  try {
    const robots = await getAllRobots();
    const channels = await getAllChannels();
    const servers = await getRobotServers();

    console.log(
      "Total Robots: ",
      robots.length,
      "\n",
      "Total Channels: ",
      channels.length
    );

    const checkRobots = await robots.map(async (robot) => {
      if (robot.status && robot.status.current_channel) {
        robot.temp_store_channel_id = robot.status.current_channel;
        const getChannel = await channels.find(
          (channel) => channel.id === robot.status.current_channel
        );
        console.log("Get current Channel for linked robot: ", getChannel.name);
        robot.channel_name = getChannel.name;
        robotsWithLinkedChannels.push(robot);
      } else robotsWithNoChannels.push(robot);
      return null;
    });

    const checkChannels = await channels.map(async (channel) => {
      let robotFound = false;
      robotsWithLinkedChannels.map((robot) => {
        if (robot.status.current_channel === channel.id) {
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
        channelsWithNoRobot
      );
    };

    await robotChannels()
      .then((robot_channels) => {
        console.log(
          "Robots With Linked Channels: ",
          robotsWithLinkedChannels.length,
          "\n",
          "Robots without a Linked Channels ( These will be deleted forever ): ",
          robotsWithNoChannels.length,
          "\n",
          "Channels without Linked Robots: ",
          channelsWithNoRobot.length,
          "\n",
          "Robot Channels Generated: ",
          robot_channels.length,
          "\n",
          "Robot Servers to Update: ",
          servers.length
        );

        return robot_channels;
      })
      .then(async (robot_channels) => {
        await saveChannels(robot_channels);
        await setDefaultChannels(robot_channels, servers);
      })
      .then(() => end());
  } catch (err) {
    console.log(err);
  }
};

const end = () => {
  console.log(
    "Servers which may have no channels: ",
    serversWithNoDefaultChannels
  );
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

buildRobotChannels = async (linkedRobots, unlinkedChannels) => {
  let robotChannels = [];
  let ignoredChannels = 0;

  console.log("Combine Linked Robots ...");

  const combineLinkedRobot = async (robot) => {
    console.log("Linked Robot Check: ", robot.name);
    const update = await makeRobotChannel({
      name: robot.channel_name, //This should be channel name
      id: robot.id,
      server_id: robot.host_id,
      owner_id: robot.owner_id,
      chat_id: robot.channel_info.chat,
      created: robot.created,
      controls: robot.channel_info.controls,
      heartbeat: robot.heartbeat,
      temp_store_channel_id: robot.temp_store_channel_id,
    });
    robotChannels.push(update);
    return update;
  };

  getChannelsFromLinkedRobots = async () => {
    return await Promise.all(
      linkedRobots.map(async (robot) => await combineLinkedRobot(robot))
    );
  };

  console.log("Converting unlinked channels into robot channels...");
  const convertUnlinkedChannel = async (channel) => {
    const { getRobotServer } = require("../models/robotServer");
    try {
      console.log("Get Server....");
      let info = await getRobotServer(channel.host_id);
      if (!info || (info && info.error)) {
        console.log("Database Fetch Error..., wait and try again...");
        await sleep(100);
        info = await getRobotServer(channel.host_id);
      }
      console.log("Server Got...");
      if (info && info.owner_id) {
        const owner = info.owner_id;
        const convert = makeRobotChannel({
          name: channel.name,
          server_id: channel.host_id,
          owner_id: owner,
          chat_id: channel.chat,
          temp_store_channel_id: channel.id,
        });
        robotChannels.push(convert);
      } else {
        ignoredChannels += 1;
      }
    } catch (err) {
      console.log("Conversion Error", err);
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
  console.log("Convert Unlinked Channels ...");
  await getConvertedUnlinkedChannels();

  console.log(
    `Done building robot channels, 
    Channels Ignored ( no host_id ) : ${ignoredChannels}`
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
  temp_store_channel_id,
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
    temp_store_channel_id: temp_store_channel_id || null,
  };
};

run().then(() => {
  console.log("The end?");
});

//Simply update the old channel id with the new id
const replaceDefault = async (server, robot_channels) => {
  const { updateRobotServerSettings } = require("../models/robotServer");
  let getDefault = await robot_channels.find(
    (channel) =>
      channel.temp_store_channel_id === server.settings.default_channel
  );

  if (!getDefault)
    getDefault = await ensureDefaultChannel(server, robot_channels);

  if (getDefault) {
    console.log(`Updating Default Channel for server: 
    ${server.server_name}, 
    ${server.settings.default_channel} \n`);
    server.settings.default_channel = getDefault.id;
    if (execute)
      return await updateRobotServerSettings(server.server_id, server.settings);
    else return server;
  }
  console.log(
    "This server likely has 0 channels, or has some other problem: ",
    server.server_name
    //KILL IT!
  );

  serversWithNoDefaultChannels += 1;
  return null;
};

const ensureDefaultChannel = async (server, robot_channels) => {
  console.log(
    "No default found from existing channels, picking a random one instead..."
  );
  let server_channels = robot_channels.filter(
    (channel) => channel.id === server.server_id
  );
  if (!Array.isArray(server_channels))
    server_channels = server_channels = [server_channels];
  console.log(
    "Check Channel: ",
    server_channels[0],
    `Check Server ${server.server_name} for stored channels`,
    server.channels
  );
  if (!server_channels[0]) {
    console.log("Find Channel...");
    const find = channelsWithNoRobot.find(
      (chan) => chan.id === server.channels[0].id
    );
    console.log(find, channelsWithNoRobot[0]);
  }

  return server_channels[0]; //Just pick the first one
};

const setDefaultChannels = async (robot_channels, robot_servers) => {
  return await Promise.all(
    await robot_servers.map(async (server) => {
      await replaceDefault(server, robot_channels);
    })
  );
};
