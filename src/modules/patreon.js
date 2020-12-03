const patreon = require("patreon");
const CLIENT_ID = require("../config/").patreonClientID;
const CLIENT_SECRET = require("../config/").patreonClientSecret;
const axios = require("axios");
const { jsonError } = require("./logging");

/**
 * Patreon Module:
 * TODO: Replace all usage of the patreon client w/ rest calls
 * Patreon client hasn't been updated since 2018 & is no longer supported
 */

const patreonOAuthClient = patreon.oauth(CLIENT_ID, CLIENT_SECRET);

module.exports.patreonGetTokens = async (redirectCode, redirectUri) => {
  try {
    const tokens = await patreonOAuthClient.getTokens(
      redirectCode,
      redirectUri
    );
    // console.log("Patreon Tokens: ", tokens);
    return tokens;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getInfoFromAccessToken = async token => {
  const { jsonError } = require("./logging");
  try {
    const pledgerClient = patreon.patreon(token);
    const info = await pledgerClient("/current_user");

    const { store } = info;
    const getPatron = await store.findAll("user").map(user => user.serialize());
    let getPatronId = "";
    getPatron.map(patron => {
      // console.log(patron.data);
      if (
        patron.data &&
        patron.data.relationships &&
        patron.data.relationships.pledges
      )
        getPatronId = patron.data.id;
    });
    if (getPatronId === "")
      return jsonError(
        "Unexpected data from Patreon API, please let us know and try again later"
      );

    return getPatronId;
  } catch (err) {
    console.log(err);
    return jsonError("Bad token data.");
  }
};

module.exports.getRemoPledgeData = async () => {
  const { creatorAccessToken, campaignId } = require("../config");
  const client = patreon.patreon(creatorAccessToken);

  //stahp spamming my console!
  const result = await client(
    `/campaigns/${campaignId}/pledges?page%5Bcount%5D=10000`
  );
  //TODO: May need a totally different method than using Patreon Module.
  const { store } = result;
  const pledges = store.findAll("pledge");
  return pledges;
};

module.exports.getPledgeData = async () => {
  const { campaignId, creatorAccessToken } = require("../config");
  const get = `https://www.patreon.com/api/oauth2/api/campaigns/${campaignId}/pledges?page%5Bcount%5D=10000`;
  return await axios
    .get(get, {
      headers: { authorization: `Bearer ${creatorAccessToken}` }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(
        "Error Fetching Patreon Data: ",
        err.response.status,
        err.response.statusText
      );
      return jsonError(err.response.statusText);
    });
};


module.exports.updatePatreonToken = async () => {
  const { patreonClientID, patreonClientSecret, creatorRefreshToken, creatorAccessToken } = require("../config");
  const get = `https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${creatorRefreshToken}&client_id=${patreonClientID}&client_secret=${patreonClientSecret}`;

  return await axios.post(get, {}, {}).then( res => {
    /* Return Data Example: 
        Token Data:  { access_token: 'newAccessTokenData',
        expires_in: 2678400,
        token_type: 'Bearer',
        scope: 'my-campaign pledges-to-me users',
        refresh_token: 'newRefreshTokenData',
        version: '0.0.1' }
*/

//Create Internal DB, Create listing for access token & refresh token
//Update Refresh Token based on timestamp in DB
//if the data in the DB is blank, update it with the latest config settings

    return res.data;
  }).catch(err => {
    console.log(err)
    console.log("REFRESH TOKEN ERROR: ", err.response.status,
    err.response.statusText);
    return jsonError(err.response.statusText);
  });
}
