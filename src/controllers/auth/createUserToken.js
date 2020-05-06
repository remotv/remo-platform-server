module.exports = async (user) => {
  const { updateSessionId } = require("../users/updateSessionId");
  const jwt = require("jsonwebtoken");
  const { log } = require("./");

  try {
    log("Create Auth Token: ", user.username);
    if (!user.session_id) user = await updateSessionId(user);
    console.log("Create User Auth Token");
    const { id, session_id } = user;
    if (!session_id)
      return jwt.sign({ id: id, session_id: session_id }, tempSecret, {
        subject: "",
        algorithm: "HS256",
      });
  } catch (err) {
    console.log(err);
  }
  return null;
};
