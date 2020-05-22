module.exports = async (id) => {
  const db = require("../../services/db");
  const query = `DELETE FROM images WHERE id =$1 RETURNING *`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};
