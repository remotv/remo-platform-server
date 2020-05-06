const { authUserData } = require("../models/user");
const {
  authRobotData,
} = require("../controllers/robotChannels/robotChannelAuth"); //moved to controller
const { extractToken, authInternal } = require("../modules/jwt");

const { logger } = require("../modules/logging");
const log = (message) => {
  logger({
    message: message,
    level: "debug",
    source: "routes/auth.js",
  });
};

const auth = (options) => {
  return async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const bearer = req.headers["authorization"].split(" ");
        const token = bearer[1];
        console.log("Token: ", token);
        const tokenData = await extractToken(token);
        log(`Token Data: ${tokenData}`);
        if (tokenData && tokenData.id) {
          let type = tokenData.id.substring(0, 4);
          if (type === "user" && options.user) {
            req.user = await authUserData(tokenData);
          } else if (type === "rbot" && options.robot) {
            req.robot = await authRobotData(tokenData);
          } else if (type === "priv") {
            req.internal = await authInternal(tokenData);
          }
        }
      }

      if (options.required && !req.user && !req.robot && !req.internal) {
        return res.json({ error: "Invalid Authorization" });
      }
      next();
    } catch (e) {
      console.log("Failed Authentication");
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = auth;
