// channels & robots > robot_channels

// name, id, created, heartbeat, server_id, chat_id, controls_id

// channels.name > robot_channels.name
// robots.id > robot_channels.id else newId
// channels.created > robot_channels.created
// robots.status[heartBeat] > robot_channels.heartbeat else epoch
// channels.host_id > robot_channels.server_id
// channels.chat > robot_channels.chat_id
// channels.controls > robot_channels.controls_id

/*
CREATE TABLE robot_channels (
    name text NOT NULL,
    id text NOT NULL PRIMARY KEY,
    created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    heartbeat timestamp NOT NULL DEFAULT '1970-1-1',
    server_id text NOT NULL REFERENCES robot_servers(server_id) ON DELETE CASCADE,
    chat_id text NOT NULL,
    control_id text NOT NULL REFERENCES controls(id) ON DELETE CASCADE
);
*/
//make chat_rooms.id a primary key later
const db = require("../services/db");
const uuidv4 = require("uuid/v4");

function newId() {
  return "rbot-" + uuidv4();
}

function findRobotDataElse(channelId, robots) {
  for (const robot of robots) {
    if (
      robot.status &&
      robot.status.current_channel &&
      robot.status.current_channel === channelId
    ) {
      return {
        id: robot.id,
        heartbeat: robot.status.heartBeat || 0,
        existing: true,
      };
    }
  }

  return { id: newId(), heartbeat: 0 };
}

async function run() {
  const channelsQuery = await db.query("SELECT * FROM channels");
  const channels = channelsQuery.rows;

  const robotsQuery = await db.query("SELECT * FROM robots");
  const robots = robotsQuery.rows;

  for (const channel of channels) {
    const robotData = findRobotDataElse(channel.id, robots);
    const name = channel.name;
    const id = robotData.id;
    const created = new Date(parseInt(channel.created) || 0);
    const heartbeat = new Date(robotData.heartbeat);
    const server_id = channel.host_id;
    const chat_id = channel.chat;
    const control_id = channel.controls;

    try {
      await db.query(
        "INSERT INTO robot_channels (name, id, created, heartbeat, server_id, chat_id, control_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [name, id, created, heartbeat, server_id, chat_id, control_id]
      );
    } catch (e) {
      if (e.code == "23503") {
        console.log(`${server_id} not found`);
      } else {
        console.error(e);
      }
    }
  }
}

run().then(() => {
  console.log("done");
});
