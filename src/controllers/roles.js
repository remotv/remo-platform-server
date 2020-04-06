const { jsonError } = require("../modules/logging");
const { getRobotServer } = require("../models/robotServer");

//Manage & Verify member roles for server.

//local roles, global roles
//default owner
//can add moderator

//LOCAL ROLES
module.exports.authLocal = async (user, server, role) => {
  try {
    // console.log(
    //   "Auth Local: ",
    //   user.username || user.id || user,
    //   server.server_name || server.server_id || server
    // );
    if (server && !server.owner_id && server.server_id) {
      server = await getRobotServer(server.server_id);
    }
    // console.log("Checking Roles: ");
    if (user.id === server.owner_id) return { authorized: true };
  } catch (err) {
    console.log("Auth Failure");
    return jsonError("Authorization Failure");
  }
  return jsonError("Not authorized");
};

//Better method, just returns true or false
module.exports.authRole = async (user, server, role) => {
  try {
    if (server && !server.owner_id && server.server_id) {
      server = await getRobotServer(server.server_id);
    }
    if ((!role || role === "owner") && user.id === server.owner_id) return true;
  } catch (err) {
    console.log("Auth Failure");
  }
  return false;
};
