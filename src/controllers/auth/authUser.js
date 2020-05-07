module.exports = async (token) => {
  const { extractToken, authUserData, log } = require("./");
  //extract token, validate data, and return authorized user or null
  try {
    log(`Auth user w/ Token`);
    const tokenData = await extractToken(token);
    if (!tokenData) throw Error(`Unable to extract token from data`);
    const user = await authUserData(tokenData);
    if (!user) throw Error(`Unable to authorize user w/ token data`);
    return user;
  } catch (err) {
    log(err.message);
  }
  return null;
};
