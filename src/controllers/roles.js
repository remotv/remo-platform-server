const { getRobotServer } = require("../models/robotServer");
//Manage & Verify member roles for a server.
//default member role check is for owner

module.exports.authMemberRole = async (user, server, role) => {
  console.log("INPUT FROM AUTH MEMBER: ", user, server, role);
  //TODO:
  //If the incoming props only contain IDs, pull info from the DB
  //otherwise assume that incoming props as objects already contain info from the server

  try {
    if (server && typeof server === "string")
      server = await getRobotServer(server);
    else if (server && !server.owner_id && server.server_id) {
      server = await getRobotServer(server.server_id);
    }
    if ((!role || role === "owner") && user.id === server.owner_id) return true;
  } catch (err) {
    console.log("Auth Failure", err);
  }
  return false;
};
