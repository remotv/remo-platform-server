module.exports = async (tokenData) => {
  const { getUserInfoFromId } = require("../../models/user");
  const { rejectAuthForUser } = require("./");
  const { log } = require("./");
  try {
    //require data
    if (!tokenData) throw Error(`Unable to extract data from token ${token}`);
    if (tokenData && !tokenData.id)
      throw Error(`Token { id } required, ${tokenData}`);

    //get user associated with token data:
    const user = await getUserInfoFromId(tokenData.id);
    if (!user) throw Error(`Unable to get user data from token: ${tokenData}`);
    if (user && user.id && user.id !== tokenData.id)
      throw Error(`Invalid Token Data for ID: ${tokenData.id}`);

    //handle invalid sessions, send logout event to expired user / session
    if (user.session_id && !tokenData.session_id) {
      //rejectAuthForUser(user); uneeded? ws will disconnect if no user is returned from authData disconnecting all clients of x user will just cause issues
      throw Error(`Invalid session data for user, ${user.username}`);
    }

    if (
      user.session_id &&
      tokenData.session_id &&
      user.session_id !== tokenData.session_id
    ) {
      //logout invalid sessions
      console.log(`Rejecting auth for user: ${user.username}\nCurrent Session: ${user.session_id}\nProvided Session: ${tokenData.session_id}`)
      rejectAuthForUser(user, tokenData.session_id);
      throw Error(`Session is expired for user, ${user.username}`);
    }

    //return user from DB on success, else log error and return null
    return user;
  } catch (err) {
    log(err.message);
  }
  return null;
};

const testLogout = async (user, logoutUser) => {
  const { rejectAuthForUser } = require("./");
  if (user.username === logoutUser) {
    console.log("LOGOUT USER: ", user.username);
    setTimeout(() => {
      rejectAuthForUser(user);
    }, 10 * 1000);
  }
};
