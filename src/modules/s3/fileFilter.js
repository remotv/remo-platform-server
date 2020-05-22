// The function should call `cb` with a boolean to indicate if the file should be accepted
module.exports = (req, file, cb) => {
  try {
    console.log("FILE FILTER: ", { file });
    // To accept the file pass `true`, like so:
    if (file) cb(null, true);
    else cb(null, false);

    // You can always pass an error if something goes wrong:
    //  cb(new Error("I don't have a clue!"));
  } catch (err) {
    console.log(err);
    cb(null, false);

    // To reject this file pass `false`, like so:
  }
};
