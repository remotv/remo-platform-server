module.exports = async () => {
  const db = require("../services/db");
  const count = `SELECT COUNT(*) FROM robot_channels`;
  try {
    const result = await db.query(count);
    if (result) return result.rows[0].count;
  } catch (err) {
    console.log(err);
  }
  return "...";
};
