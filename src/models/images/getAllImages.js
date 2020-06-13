module.exports = async () => {
  const db = require("../../services/db");
  const query = `SELECT * FROM images`;
  try {
    const result = await db.query(query);
    if (result.rows) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};
