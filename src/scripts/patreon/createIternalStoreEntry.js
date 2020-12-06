run = async () => {
   const { getEntryByRef, saveEntry } = require("../../models/internalStore");
   const { creatorAccessToken, creatorRefreshToken } = require("../../config");

   try {

    const patreonData = await getEntryByRef("patreon");
    console.log("Internal Patreon Data: ", patreonData);
    if (!patreonData) { //if no data, initialize data from config
      const savePatreonEntry = {
        ref: "patreon",
        data: {
          access_token: creatorAccessToken,
          refresh_token: creatorRefreshToken
        }
      }
      const save = await saveEntry(savePatreonEntry);
      console.log("Save Entry Result: ", save);
    }

  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

run();