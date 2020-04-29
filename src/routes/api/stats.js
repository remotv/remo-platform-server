const router = require("express").Router();
const {
  getActiveUsers,
  getActiveRobots,
  getTotalUserCount,
  getRobotServerCount,
  getTotalRobotCount,
} = require("../../controllers/stats");

router.get("/", async (req, res) => {
  try {
    res.status(200).send({
      activeUsers: await getActiveUsers(),
      totalUsers: await getTotalUserCount(),
      totalServers: await getRobotServerCount(),
      activeDevices: await getActiveRobots(),
      registeredDevices: await getTotalRobotCount(),
    });
  } catch (err) {
    return res.status(500).send({ error: "unable to get stats." });
  }
});

module.exports = router;
