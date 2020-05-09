const {
  authRobotData,
} = require("../controllers/robotChannels/robotChannelAuth"); //moved to controller
const {
  extractToken,
  authInternalTokenData,
  authUserData,
} = require("../controllers/auth");
const { logger } = require("../modules/logging");
const auth = (options) => {
  return async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const bearer = req.headers["authorization"].split(" ");
        const token = bearer[1];
        // console.log("TOKEN CHECK: ", token, "\n");
        const tokenData = await extractToken(token);
        // console.log("EXTRACT TOKEN DATA: ", tokenData);
        if (tokenData && tokenData.id) {
          let type = tokenData.id.substring(0, 4);
          if (type === "user" && options.user) {
            req.user = await authUserData(tokenData);
          } else if (type === "rbot" && options.robot) {
            req.robot = await authRobotData(tokenData);
          } else if (type === "priv") {
            req.internal = await authInternalTokenData(tokenData);
          }
        }
      }

      if (options.required && !req.user && !req.robot && !req.internal) {
        return res.json({ error: "Invalid Authorization" });
      }
      next();
    } catch (e) {
      logger({
        level: "debug",
        source: "routes/auth.js",
        message: e.message,
      });
      res.status(401).json({ error: "Invalid token data." });
    }
  };
};

module.exports = auth;
