module.exports = async (token) => {
  const { extractToken } = require("./extractToken");
  const { getUserInfoFromid } = require("../../models/user");
  const { log } = require("./");
  try {
    //extract data from token:
    const tokenData = await extractToken(token);

    //require data
    if (!tokenData) throw Error("Unable to extract data from token");
    if (tokenData && !tokenData.id)
      throw Error("Invalid token data, must contain element, id");

    //get user w/ token data:
    const user = await getUserInfoFromid(tokenData.id);
    if (!user) throw Error("Unable to get user data from token.");
    if (user && user.id && user.id !== tokenData.id)
      throw Error("Invalid token data for id");

    //if session data is present, validate session data as well
    if (
      (user.session_id && !tokenData.session_id) ||
      user.session_id !== tokenData.session_id
    )
      throw Error("Invalid token data for session");

    //return user from DB on success, else log error and return null
    return user;
  } catch (err) {
    log(err.message);
  }
  return null;
};
