/**
 * If you haven't run the init script first, do that instead
 * If patreon data is already in the internal store, use this script to manually update 
 * creator access and refresh tokens from the config file. 
 */
run = async () => {
   const { getEntryByRef, updateEntryByRef } = require("../../models/internalStore");
   const { creatorAccessToken, creatorRefreshToken } = require("../../config");

   try {

    const patreonData = await getEntryByRef("patreon");
    console.log("Internal Patreon Data: ", patreonData);
    if (patreonData) { //if there is no data, don't run, you should run the init script instead
      const savePatreonEntry = {
        ref: "patreon",
        data: {
          access_token: creatorAccessToken,
          refresh_token: creatorRefreshToken
        }
      }
      const update = await updateEntryByRef(savePatreonEntry);
      console.log("Update Entry Result: ", update);
    }

  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

run();