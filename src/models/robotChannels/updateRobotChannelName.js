module.exports = async ({ name, id }) => {
  const db = require("../../services/db");
  const query = `UPDATE robot_channels SET name = $1 WHERE id = $2 RETURNING *`;
  try {
    const result = await db.query(query, [name, id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return jsonError("Unable to name channel, please try again later");
};
