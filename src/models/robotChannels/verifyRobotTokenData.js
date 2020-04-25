module.exports = async (token) => {
  const db = require("../../services/db");
  try {
    const query = `SELECT * FROM robots WHERE id = $1 LIMIT 1`;
    const result = await db.query(query, [token["id"]]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};
