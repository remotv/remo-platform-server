//WARNING: DO NOT ALLOW A CHANNEL TO GET DELETED IF A SERVER ONLY CONTAINS ONE
module.exports = async (id) => {
  const db = require("../../services/db");
  const query = `DELETE FROM robot_channels WHERE id =$1 RETURNING *`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.test__deleteRobotChannel = async (id) => {
  try {
    const deleteRobotChannel = module.exports;
    return await deleteRobotChannel(id);
  } catch (err) {
    console.log(err);
    return null;
  }
};
