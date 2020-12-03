const run = async () => {
   const db = require("../../../services/db");
   const update = `
   CREATE TABLE public.internal_store (
    patreon_client_id character varying NOT NULL PRIMARY KEY,
    patreon_refresh_token character varying,
    patreon_data_last_updated timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
   );`;
   try {
     console.log("Updating Table...");
     const result = await db.query(update);
     console.log(result.rows[0]);
   } catch (err) {
     console.log(err);
   }
   process.exit();
 };
 
 run();