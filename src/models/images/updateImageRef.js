module.exports = async ({ id, ref }) => {
  const db = require("../../services/db");
  const query = `UPDATE images SET ref = $1 WHERE id = $2 RETURNING *`;
  try {
    const result = await db.query(query, [ref, id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};
