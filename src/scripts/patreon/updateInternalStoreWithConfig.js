run = async () => {
   const { getEntryByRef, updateEntryByRef } = require("../../models/internalStore");
   const { creatorAccessToken, creatorRefreshToken } = require("../../config");

   try {

    const patreonData = await getEntryByRef("patreon");
    console.log("Internal Patreon Data: ", patreonData);
    if (patreonData) { //if no data, initialize data from config
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