module.exports = async ({ ref, data }) => {
   const db = require("../../services/db");
   const query = `UPDATE internal_store SET ( data, updated ) = ( $2, CURRENT_TIMESTAMP ) WHERE ref = $1 RETURNING *`;
   console.log("Updated Internal Store for: ",ref);
   try {
      const result = await db.query(query, [ref, data]);
      if (result.rows[0]) return result.rows[0];
   } catch (err) {
      console.log(err);
   }
   return null;
}