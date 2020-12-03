const { err } = require("../modules/utilities");
const { jsonError } = require("../modules/logging");

//Triggers API call from client to update the currently selected robot server
module.exports.updateSelectedServer = (server_id) => {
  const wss = require("../services/wss");
  wss.clients.forEach((ws) => {
    if (ws.server_id === server_id) {
      ws.emitEvent("SELECTED_SERVER_UPDATED");
    }
  });
};

module.exports.deleteRobotServer = async (server_id) => {
  const { deleteRobotServer } = require("../models/robotServer");
  const remove = await deleteRobotServer(server_id);
  console.log("DELTING SERVER: ", remove);
};

module.exports.updateSettings = async (server, user_id) => {
  const {
    getRobotServer,
    updateRobotServerSettings,
  } = require("../models/robotServer");
  const { authMemberRole } = require("./roles");

  let getServer = await getRobotServer(server.server_id);
  const authUpdate = await authMemberRole({ id: user_id }, getServer);

  if (authUpdate) {
    if (server.settings.hasOwnProperty("private"))
      getServer.settings.private = server.settings.private;
    if (server.settings.hasOwnProperty("unlist"))
      getServer.settings.unlist = server.settings.unlist;
    if (server.settings.hasOwnProperty("phonetic_filter"))
      getServer.settings.phonetic_filter = server.settings.phonetic_filter;
    if (server.settings.hasOwnProperty("announce_followers_in_chat"))
      getServer.settings.announce_followers_in_chat =
        server.settings.announce_followers_in_chat;
    const updateSettings = await updateRobotServerSettings(
      getServer.server_id,
      getServer.settings
    );
    if (updateSettings) return updateSettings.settings;
  }

  this.updateSelectedServer(getServer.server_id);
  return null;
};

module.exports.getPublicServers = async () => {
  const { getRobotServersWithOwner } = require("../models/robotServer");
  let getServers = await getRobotServersWithOwner();
  let list = [];
  getServers.forEach((server) => {
    if (server.settings.unlist === true || server.settings.private === true) {
      //do nothing
    } else {
      list.push(server);
    }
  });
  return list;
};

//user membership status is appended to the server object
module.exports.getServerByName = async (name, user) => {
  const { getRobotServerFromName } = require("../models/robotServer");
  const { getMember } = require("../models/serverMembers");
  let membership = null;
  let getServer = await getRobotServerFromName(name);

  if (!getServer) return err("This server doesn't exist");
  if (user) membership = await getMember({
    user_id: user.id,
    server_id: getServer.server_id,
  });
  getServer.membership = membership || null;
  // console.log("////////GET SERVER CHECK: ", getServer, user);
  if (getServer.settings.private === true) return checkMembership(getServer);
  // if (getServer.settings.unlist && !user)
  return getServer;
};

const checkMembership = async (server) => {
  const { status } = server.membership;
  // console.log(check);
  if (status.member === true) {
    return server;
  }
  return err("You are not a member of this server.");
};

//For displaying public server information relating to a server.
module.exports.getPublicServerInfo = async (server) => {
  const { getPublicUserFromId } = require("../controllers/user");
  const user = await getPublicUserFromId(server.owner_id);
  const publicInfo = {
    server_name: server.server_name,
    server_id: server.server_id,
    created: server.created,
    owner_id: server.owner_id,
    owner_name: user.username,
    default_channel: server.default_channel,
    members: server.status.count,
    public: server.status.public,
    live_devices: server.status.liveDevices,
    default_channel: server.settings.default_channel,
    image_id: server.image_id,
  };
  return publicInfo;
};

module.exports.getServerById = async (server_id) => {
  const { getRobotServer } = require("../models/robotServer");
  const server = await getRobotServer(server_id);
  if (server) {
    return server;
  }
  return jsonError("Unable to get requested server information");
};
