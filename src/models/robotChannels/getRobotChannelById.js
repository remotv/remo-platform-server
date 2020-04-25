module.exports = async (id) => {
  const db = require("../../services/db");
  try {
    const query = `SELECT * FROM robot_channels WHERE id = $1 LIMIT 1`;
    const result = await db.query(query, [id]);
    // console.log(result.rows[0]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return { error: "Could not fetch information for this channel" };
};
