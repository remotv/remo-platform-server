module.exports = async (req, res, next) => {
  const { authMemberRole } = require("../../controllers/roles");
  const { getRobotServer } = require("../../models/robotServer");
  try {
    const server = await getRobotServer(req.params.id);
    const auth = await authMemberRole(req.user, server);
    if (auth) {
      req.server = server;
      next();
    } else {
      res.status(401).json({ error: "not authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Error" });
  }
};
