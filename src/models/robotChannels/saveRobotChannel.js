module.exports = async ({ name, id, server_id, chat_id, controls_id }) => {
  const db = require("../../services/db");
  const { log } = require("./");
  const query = `INSERT INTO robot_channels (name, id, server_id, chat_id, controls_id) VALUES ( $1, $2, $3, $4, $5 )`;
  try {
    log(`Saving Robot Channel: ${name} ${id}`);
    const result = await db.query(query, [
      name,
      id,
      server_id,
      chat_id,
      controls_id,
    ]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};
