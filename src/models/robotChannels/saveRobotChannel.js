module.exports = async ({
  name,
  id,
  type,
  server_id,
  owner_id,
  chat_id,
  created,
  controls_id,
  heartbeat,
  secret_key,
}) => {
  const db = require("../../services/db");
  const { log } = require("./");
  const save = [
    name,
    id,
    type,
    server_id,
    owner_id,
    chat_id,
    created,
    controls_id,
    heartbeat,
    secret_key,
  ];
  const query = `INSERT INTO robot_channels (name, id, type, server_id, owner_id, chat_id, created, controls_id, heartbeat, secret_key) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )`;
  try {
    const result = null;
    log(`Saving Robot Channel: ${name}`);
  } catch (err) {
    console.log(err);
  }
  return null;
};
