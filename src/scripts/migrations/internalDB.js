const run = async () => {
   const db = require("../../services/db");
   const update = `
   CREATE TABLE public.internal_store (
    ref character varying NOT NULL PRIMARY KEY,
    data jsonb,
    updated timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
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