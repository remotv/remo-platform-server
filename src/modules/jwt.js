// const config = require("../config");
// const jwt = require("jsonwebtoken");
// const tempSecret = config.secret;

// module.exports.extractToken = async (token) => {
//   //   console.log("Verifying Auth Token is this file savedwait what the ", token);
//   let checkToken = null;
//   try {
//     return (checkToken = await new Promise((resolve, reject) => {
//       jwt.verify(token, tempSecret, "HS256", (err, res) => {
//         // if (token) console.log("JWT Verified");
//         if (err) return reject(err);
//         return resolve(res);
//       });
//     }));
//   } catch (err) {
//     let reason = {
//       error: "problem creating token from user",
//     };
//     //Promise.reject(reason);
//     //console.log(reason);
//     return null;
//   }
// };

// module.exports.createInternalAuth = (data) => {
//   return jwt.sign({ id: data }, tempSecret, {
//     subject: "",
//     algorithm: "HS256",
//   });
// };

// module.exports.authInternal = (data) => {
//   const { internalKey } = require("../config");
//   console.log("AUTH INTERNAL: ", data, internalKey);
//   return new Promise((resolve, reject) => {
//     if (data && data.id && data.id === `priv-${internalKey}`)
//       return resolve(data);
//     else return reject({ error: "supplied key does not match internal key" });
//   });
// };
