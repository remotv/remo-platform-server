module.exports = (data) => {
  const { secret } = require("../../config");
  const jwt = require("jsonwebtoken");
  try {
    return jwt.sign({ id: data }, secret, {
      subject: "",
      algorithm: "HS256",
    });
  } catch (err) {
    console.log(err);
  }
  return null;
};
