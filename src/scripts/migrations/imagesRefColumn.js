const run = async () => {
  const db = require("../../services/db");
  const update = `
    ALTER TABLE images 
    ADD COLUMN ref character varying;
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
