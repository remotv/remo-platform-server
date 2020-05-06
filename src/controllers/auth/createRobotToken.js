module.exports = async (robot) => {
  const jwt = require("jsonwebtoken");
  const { log } = require("./");
  try {
    log("Create Robot Auth Token: ", robot.name);
    const { id } = user;
    return jwt.sign({ id: id }, tempSecret, {
      subject: "",
      algorithm: "HS256",
    });
  } catch (err) {
    console.log(err);
  }
  return null;
};
