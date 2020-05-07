module.exports = (data) => {
  const { internalKey } = require("../../config");
  console.log("AUTH INTERNAL: ", data, internalKey);
  return new Promise((resolve, reject) => {
    if (data && data.id && data.id === `priv-${internalKey}`)
      return resolve(data);
    else return reject({ error: "supplied key does not match internal key" });
  });
};
