module.exports = async ({ id, user_id, approved, ref }) => {
  const db = require("../../services/db");
  const { log } = require("./");
  const query = `INSERT INTO images ( id, user_id, approved, ref ) VALUES ( $1, $2, $3, $4 ) RETURNING *`;
  try {
    log(`Saving new image! ${id}`);
    const result = await db.query(query, [id, user_id, approved, ref]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

// module.exports.test = async (data) => {
//   try {
//     const saveImage = module.exports;
//     return await saveImage(data);
//   } catch (err) {
//     console.log(err);
//   }
//   return null;
// };
