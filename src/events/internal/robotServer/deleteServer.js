module.exports = async (ws, data) => {
  const { deleteRobotServer } = require("../../../models/robotServer");
  const wss = require("../../../services/wss");
  const { server_id } = data;
  try {
    console.log("MODERATION - Deleting Robot Server: ", server_id);
    if (ws.internalListener) {
      const remove = await deleteRobotServer(server_id);
      let result = "";
      if (remove) result = "Success!";
      else result = "Error, server may not have been deleted";
      wss.emitInternalEvent("DELETE_ROBOT_SERVER", {
        server_id: server_id,
        result: result,
      });
    }
  } catch (err) {
    console.log(err);
  }
  //deleteServer
};
