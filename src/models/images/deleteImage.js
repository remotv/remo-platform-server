module.exports = async ({ id }) => {
  const db = require("../../services/db");
  const query = `DELETE FROM images WHERE id =$1`;
  try {
    const result = await db.query(query, [id]);
    if (result.rowCount > 0) return true;
  } catch (err) {
    console.log(err);
  }
  return null;
};
