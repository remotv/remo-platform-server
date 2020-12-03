const run = async () => {
  const db = require("../../../services/db");
  const update = `
  CREATE TABLE public.images (
   id character varying NOT NULL PRIMARY KEY,
   user_id character varying,
   created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
   approved boolean
);
    `;
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
