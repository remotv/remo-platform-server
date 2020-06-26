module.exports = async (req, file, cb) => {
  const { saveImageForServer } = require("../../controllers/images");
  try {
    req.image = await saveImageForServer(req.user, req.server, file);
    if (!req.image) throw new Error("No Image!");
    let type = "";
    if (file.mimetype === "image/jpeg") type = "jpg";
    else if (file.mimetype === "image/png") type = "png";
    if (type === "") throw new Error("File extension error");
    cb(null, `user/${req.image.id}`); //all user generated images go here
  } catch (err) {
    console.log(err);
    cb(new Error("There was a problem saving the file"));
  }
};
