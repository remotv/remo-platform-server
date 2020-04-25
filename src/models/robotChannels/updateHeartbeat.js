module.exports = async (id) => {
  const db = require("../../services/db");
  const query = `UPDATE robot_channels SET heartbeat = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return { error: "Could not update controls at this time" };
};
