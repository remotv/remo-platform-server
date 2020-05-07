module.exports = async (user) => {
  const { updateSessionId } = require("../users");
  const jwt = require("jsonwebtoken");
  const { log } = require("./");
  const { secret } = require("../../config");
  try {
    log(`Create Auth Token For: ${user.username}`);
    if (!user.session_id) user = await updateSessionId(user);
    const { id, session_id } = user;
    if (!session_id) throw Error(`Unable to udpate session data for token`);
    return jwt.sign({ id: id, session_id: session_id }, secret, {
      subject: "",
      algorithm: "HS256",
    });
  } catch (err) {
    console.log(err);
  }
  return null;
};
