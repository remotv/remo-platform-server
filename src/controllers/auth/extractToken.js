module.exports = (token) => {
  const jwt = require("jsonwebtoken");
  const { secret } = require("../../config");
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, "HS256", (err, res) => {
      if (err) return reject({ error: "unable to extract token" });
      return resolve(res);
    });
  });
};
