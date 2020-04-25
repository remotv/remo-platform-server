const http = require("../http");
require("../wss");

const { serverPort } = require("../../config");

const app = require("../express");
const port = serverPort;

const init = require("../../scripts/init");
init(); //Initialize scripts on server start
/*
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});
*/
//run server
const server = http.listen(port, () => {
  if (app.get("env") === "test") return;
  console.log(`Server listening on port ${port}!`);
});

server.on("close", () => {
  console.log("Closed express server");

  db.pool.end(() => {
    console.log("Shut down connection pool");
  });
});
