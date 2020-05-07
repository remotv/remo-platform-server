module.exports = async (token) => {
  const { extractToken } = require("./extractToken");
  const { getUserInfoFromid } = require("../../models/user");
  const { log } = require("./");
  try {
    //extract data from token:
    const tokenData = await extractToken(token);

    //require data
    if (!tokenData) throw Error(`Unable to extract data from token ${token}`);
    if (tokenData && !tokenData.id)
      throw Error(`Token { id } required, ${tokenData}`);

    //get user w/ token data:
    const user = await getUserInfoFromid(tokenData.id);
    if (!user) throw Error(`Unable to get user data from token: ${tokenData}`);
    if (user && user.id && user.id !== tokenData.id)
      throw Error(`Invalid Token Data for ID: ${tokenData.id}`);

    //if session data is present, validate session data as well
    if (
      (user.session_id && !tokenData.session_id) ||
      user.session_id !== tokenData.session_id
    )
      throw Error(`Invalid token data for session: ${tokenData.session_id}`);

    //return user from DB on success, else log error and return null
    return user;
  } catch (err) {
    log(err.message);
  }
  return null;
};
