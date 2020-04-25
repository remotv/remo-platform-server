module.exports = async () => {
  const db = require("../../services/db");
  const query = `SELECT * FROM robot_channels`;
  try {
    const result = await db.query(query);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};
