module.exports = async ({ id, approved }) => {
  const db = require("../../services/db");
  const query = `UPDATE images SET approved = $1 WHERE id = $2 RETURNING *`;
  try {
    const result = await db.query(query, [approved, id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return { error: "Could not update controls at this time" };
};
