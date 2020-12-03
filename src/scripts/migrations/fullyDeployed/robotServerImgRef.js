const run = async () => {
  const db = require("../../../services/db");
  const update = `
   ALTER TABLE robot_servers 
   ADD COLUMN image_id character varying REFERENCES images(id) ON DELETE CASCADE;
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
