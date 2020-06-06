const run = async () => {
  const db = require("../../../services/db");
  const updateColumn = `
      ALTER TABLE users 
      DROP COLUMN session,
      ADD COLUMN session_id character varying;
   `;
  try {
    console.log("Updating Table...");
    const result = await db.query(updateColumn);
    console.log(result.rows[0]);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

run();
