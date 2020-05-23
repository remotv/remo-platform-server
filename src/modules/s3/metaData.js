//attach meta data for s3 objects ( final result is xml )
module.exports = (req, file, cb) => {
  try {
    console.log("File: ", file);
    let data = {
      fieldName: file.fieldName,
      user_id: req.user.id,
      username: req.user.username,
    };

    if (req.params.server_id) data.server_id = req.params.server_id;

    cb(null, {
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
