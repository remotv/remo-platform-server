const router = require("express").Router();

router.use("/api", require("./internal"));

module.exports = router;
