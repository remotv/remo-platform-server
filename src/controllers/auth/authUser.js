module.exports = async (token) => {
  const { extractToken, authUserData, log } = require("./");
  //extract token, validate data, and return authorized user or null
  try {
    log(`Auth user w/ Token`);
    const tokenData = await extractToken(token);
    if (!tokenData) {
      log("unable to extract data from token.");
      return null;
    }
    const user = await authUserData(tokenData);
    if (!user) {
      log(`Unable to authorize user w/ token data`);
      return null;
    }
    return user;
  } catch (err) {
    log(err.message);
  }
  return null;
};
