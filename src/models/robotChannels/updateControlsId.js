module.exports = async (id, controls_id) => {
  const db = require("../../services/db");
  const query = `UPDATE robot_channels SET controls_id = $1 WHERE id = $2 RETURNING *`;
  try {
    const result = await db.query(query, [controls_id, id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return { error: "Could not update controls at this time" };
};
