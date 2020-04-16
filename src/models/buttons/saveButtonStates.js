//Currently unused.
module.exports = async (button) => {
  const db = require("../../services/db");
  const { id, cooldown, enabled, updated } = button;
  const query = `INSERT INTO buttons ( id, timestamp  )`;
  try {
    const result = await db.query(query[(id, cooldown, enabled, updated)]);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * ive never stored any of my sort of voting states in memory but i would have a row in a table for each button for each user (when they press it ofcourse)
and a cleanup service
so like
user id text
button id text
pressed timestamp
primary key(user id, button id)

 * and then cache the result from that so if the database says they pressed it at x + timeout dont request before them
but store when they press not when it expires
incase the owner sets it to a year or something

 */
