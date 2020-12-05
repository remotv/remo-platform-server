module.exports = async ({ ref, data }) => {
   const db = require("../../services/db");
   console.log("Saving new Entry to Internal DB: ", ref);
   const query = `INSERT INTO internal_store (ref, data, updated ) VALUES ( $1, $2, CURRENT_TIMESTAMP ) RETURNING *`;
   try {
      const result = await db.query(query, [ref, data]);
      if (result.rows[0]) return result.rows[0];
   } catch(err) {
      console.log(err)
   }
   return null;
}