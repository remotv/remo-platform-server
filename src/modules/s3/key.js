module.exports = async (req, file, cb) => {
  const { saveImageForServer } = require("../../controllers/images");
  try {
    req.image = await saveImageForServer(req.user, req.server);
    if (!req.image) throw new Error("No Image!");
    cb(null, "user/" + req.image.id); //all user generated images go here
  } catch (err) {
    console.log(err);
    cb(new Error("There was a problem saving the file"));
  }
};
