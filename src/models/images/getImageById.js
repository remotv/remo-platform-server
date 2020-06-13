module.exports = async ({ id }) => {
  const db = require("../../services/db");
  const query = `SELECT * FROM images WHERE id = $1`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};
