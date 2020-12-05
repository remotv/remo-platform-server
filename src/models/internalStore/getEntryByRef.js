module.exports = async ( ref ) => {
   const db = require("../../services/db");
   const query = `SELECT * FROM internal_store WHERE ref = $1`
   console.log("Get item from internal store: ", ref);
   try {
      const result = await db.query(query, [ref]);
      if (result.rows[0]) return result.rows[0];
   } catch (err) {
      console.log(err);
   }
   return null;
}