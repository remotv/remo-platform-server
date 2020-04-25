module.exports = async (server_id) => {
  const db = require("../../services/db");
  try {
    const query = `SELECT * FROM robot_channels WHERE server_id = $1`;
    const result = await db.query(query, [server_id]);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};
