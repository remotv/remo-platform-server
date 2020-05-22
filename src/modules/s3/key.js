const { uuid } = require("uuidv4");
module.exports = (req, file, cb) => {
  try {
    let extension = "";
    if (file && file.mimetype === "image/jpeg") extension = "jpg";
    else if (file && file.mimetype === "image/png") extension = "png";
    cb(null, `imgs-${uuid()}.${extension}`);
  } catch (err) {
    console.log(err);
    cb(new Error("There was a problem saving the file"));
  }
};
