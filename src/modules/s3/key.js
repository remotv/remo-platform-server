module.exports = async (req, file, cb) => {
  const { makeId } = require("../utilities");
  const { saveImage } = require("../../models/images");
  try {
    const imageId = `imgs-${makeId()}`;
    req.image = await saveImage({
      id: imageId,
      user_id: req.user.id,
      approved: null,
    });
    // req.image = promiseImage;
    // let extension = "";
    // if (file && file.mimetype === "image/jpeg") extension = "jpg";
    // else if (file && file.mimetype === "image/png") extension = "png";
    cb(null, imageId);
  } catch (err) {
    console.log(err);
    cb(new Error("There was a problem saving the file"));
  }
};
