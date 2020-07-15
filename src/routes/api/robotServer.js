const router = require("express").Router();
const {
  createRobotServer,
  getRobotServer,
  deleteRobotServer,
  updateRobotServer,
} = require("../../models/robotServer");

const { checkTypes } = require("../../models/user");
const auth = require("../auth");
const { jsonError, logger } = require("../../modules/logging");

//LIST ACTIVE SERVERS
router.get("/list", async (req, res) => {
  const { getPublicServers } = require("../../controllers/robotServer");
  const { maxServersPerPage } = require("../../config")
  const { splitToChunks } = require("../../modules/utilities")
  let display = await getPublicServers();
  if ((typeof req.query.page !== 'undefined') /*if the page param is included in the query*/ && (!isNaN(+req.query.page)) /*check if it is a number*/ && (Number.isInteger(+req.query.page)) /*check if it is whole (page 2.4 isn't possible)*/) { 
    let pageNum = +req.query.page;
    display = splitToChunks(display, maxServersPerPage)[pageNum-1]
  } else {
    //allow for some time before depreciation of not using page param
  }
  res.send(display);
});

router.get("/members", async (req, res) => {
  let response = {};
  const { getMembers } = require("../../models/serverMembers");
  if (req.body.server_id) {
    const listMembers = await getMembers(req.body.server_id);
    response = listMembers;
  } else {
    response.status = "Error!";
    response.error = "Unable to get members";
  }
  res.send(response);
});

router.post("/get-members", auth({ user: true }), async (req, res) => {
  const { getMembers } = require("../../controllers/members");
  if (!req.body.server_id) return res.send(jsonError("Invalid Server ID"));
  const members = await getMembers(req.body.server_id);
  return res.send(members);
});

router.post("/get-member", auth({ user: true }), async (req, res) => {
  const { getMember } = require("../../controllers/members");
  const { server_id } = req.body;
  if (server_id) return res.send(jsonError("Invalid Server ID"));
  const member = await getMember({
    user_id: req.body.user.id,
    server_id: server_id,
  });
  return res.send(member);
});

//CREATE SERVER
router.get("/create", (req, res) => {
  const response = {
    server_name: "required",
    authorization: "Bearer token must be included in authorization headers",
  };
  res.send(response);
});

//generate invite for a server, right now only owner can make this
router.post("/invite", auth({ user: true }), async (req, res) => {
  if (req.user && req.body.server_id) {
    const { makeInvite } = require("../../controllers/members");
    const generate = await makeInvite({
      user: req.user,
      server_id: req.body.server_id,
      expires: req.body.expires || null,
    });
    res.send(generate);
    return;
  }
  (response.status = "error"), (response.error = "Unable to generate invite");
  res.send(response);
});

//JOIN SERVER, MAIN METHOD FOR JOINING PUBLICLY LISTED SERVERS
router.post("/join", auth({ user: true }), async (req, res) => {
  const { joinServer } = require("../../controllers/members");
  let response = {};
  if (req.user && req.body.join && req.body.server_id) {
    const join = await joinServer({
      user_id: req.user.id,
      server_id: req.body.server_id,
      join: req.body.join,
    });

    if (join) {
      response = join;
      res.send(join);
      return;
    }
  }

  response.status = "Error!";
  response.error = "Unable to join server with provided information";
  res.send(response);
});

//First step for joining a private remo server
router.post("/validate-invite", async (req, res) => {
  const { validateServerInvite } = require("../../controllers/members");
  const {
    getServerById,
    getPublicServerInfo,
  } = require("../../controllers/robotServer");
  const { getPublicUserFromId } = require("../../controllers/user");

  if (req.body.invite) {
    logger(req.body.invite);
    const invite = await validateServerInvite(req.body.invite);

    if (invite && !invite.error) {
      //get server info:
      let server = await getServerById(invite.server_id);
      if (server) server = await getPublicServerInfo(server);
      let invited_by = await getPublicUserFromId(invite.created_by);
      res.send({ invite, server, invited_by });
      return;
    }
  }
  // console.log("BOOP");
  res.send(jsonError("This invite either doesn't exist, or is invalid"));
  return;
});

router.post("/deactivate-invite", auth({ user: true }), async (req, res) => {
  const {
    deactivateInvite,
    getInviteInfoFromId,
  } = require("../../controllers/members");
  if (req.body.id) {
    //get invite info
    const invite = await getInviteInfoFromId(req.body.id);
    if (req.user.id === invite.created_by) {
      const disable = await deactivateInvite(invite);
      res.send(disable);
      return;
    }
    //TODO: Check User Role on Server to auth deactivation
  }
  res.send(jsonError("Unable to update Invite"));
  return;
});

//LEAVE SERVER, DOES NOT DELETE USER FROM MEMBERLIST
router.post("/leave", auth({ user: true }), async (req, res) => {
  const { leaveServer } = require("../../controllers/members");
  let response = {};
  if (req.user && req.body.join && req.body.server_id) {
    const leave = await leaveServer({
      user_id: req.user.id,
      server_id: req.body.server_id,
      join: req.body.join,
    });

    if (leave) {
      response = leave;
      res.send(response);
      return;
    }
  }
  response.status = "Error!";
  response.error = "Unable to leave server";
  res.send(response);
});

//get list of invites for a specific server, right now only owner can request
router.get("/invites", auth({ user: true }), async (req, res) => {
  const { getInvitesForServer } = require("../../models/invites");
  if (req.user && req.body.server_id) {
    let getInvites = await getInvitesForServer(req.body.server_id);
    res.send(getInvites);
  }
});

router.post("/settings/update", auth({ user: true }), async (req, res) => {
  // return res.json(req.body);
  const { updateSettings } = require("../../controllers/robotServer");
  if (req.body.server.settings) {
    const update = await updateSettings(req.body.server, req.user.id);
    if (update) res.send(update);
    return;
  }
  res.send(jsonError("Unable to update server settings"));
});

/**
 * Input:
 *  server_id: string
 *  user || robot: user or robot object
 *
 * response success: { server object, membership: { member object }}
 * response error: { error: "error message" }
 */
router.post(
  "/get-server",
  auth({ user: true, robot: true, required: true }),
  async (req, res) => {
    const { getServerByName } = require("../../controllers/robotServer");
    try {
      if (!req.body.server_name)
        return res.send(jsonError("server_name required"));
      let getUser = {};
      if (req.robot) getUser.id = req.robot.owner_id;
      else getUser = req.user;
      const getServer = await getServerByName(req.body.server_name, getUser);
      res.send(getServer);
      return;
    } catch (err) {
      console.log(err);
      return res.send(jsonError(err.message));
    }
  }
);

router.post(
  "/create",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { validateServerName } = require("../../controllers/validate");
    let storeReq = req.body;
    if (req.body.server_name) {
      const validate = validateServerName(req.body.server_name);
      if (validate.error) return res.send(validate);
      storeReq.server_name = validate;
    } else {
      res.send(jsonError("server_name is required."));
      return;
    }
    const buildRobotServer = await createRobotServer(storeReq, req.user);
    res.send(buildRobotServer);
    return;
  }
);

//REMOVE SERVER
router.get("/delete", async (req, res) => {
  const response = {
    server_id: "required",
  };
  res.send(response);
});

router.post(
  "/delete",
  auth({ user: true, required: true }),
  async (req, res) => {
    // console.log("API / Robot Server / Delete: ", req.body);
    let response = {};

    if (req.user) {
      const robotServerToDelete = await getRobotServer(req.body.server_id);
      const moderator = await checkTypes(req.user, ["staff, global_moderator"]);
      if (
        (robotServerToDelete && req.user.id === robotServerToDelete.owner_id) ||
        moderator
      ) {
        response.deleting = req.body.server_id;
        try {
          if (await deleteRobotServer(req.body.server_id)) {
            response.success = `Server successfully Deleted`;
            updateRobotServer();
          } else {
            response.error = "There was a problem deleting the server";
          }
        } catch (err) {
          console.log(err);
          response.error = "Could not Delete Server";
        }
      } else {
        response.error = "Insuffecient privileges to delete server";
      }
    } else {
      response.error = "Invalid User";
    }

    res.send(response);
  }
);

/**
 * Input:
 *  server_id: string
 *  user: { user object }
 *  settings: {
 *    enable_notifications: ( boolean ) }
 *
 * response success: {
 *    settings: {...updated settings }
 * response error: { error: "error message" }
 */

router.post(
  "/membership/update-settings",
  auth({ user: true, required: true }),
  async (req, res) => {
    const { updateMemberSettings } = require("../../controllers/members");
    const { settings, server_id } = req.body;
    const result = await updateMemberSettings({
      user_id: req.user.id,
      server_id: server_id,
      settings: settings,
    });
    res.send(result);
  }
);

const { upload } = require("../../modules/s3");
const requireOwner = require("../middleware/requireOwner");
router.post(
  "/:id/upload",
  auth({ user: true, required: true }),
  requireOwner,
  upload.single("server_img"),
  async (req, res) => {
    res
      .status(200)
      .send(
        "Upload Successful! Your image has beeen submitted for approval by the moderation team. It will appear once it's been approved."
      );
  }
);

module.exports = router;
