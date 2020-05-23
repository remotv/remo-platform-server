module.exports = async (req, res, next) => {
  const { authMemberRole } = require("../../controllers/roles");
  try {
    const auth = await authMemberRole(req.user, req.params.id);
    if (auth) {
      next();
    } else {
      res.status(401).json({ error: "not authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Error" });
  }
};
