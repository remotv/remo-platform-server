//attach meta data for s3 objects ( final result is xml )
module.exports = (req, file, cb) => {
  try {
    console.log("File: ", file);
    cb(null, {
      fieldName: file.fieldname,
      user_id: req.user ? req.user.id : "no-id-test-value",
      server_id: req.server_id ? req.server_id : "no-id-test-value",
    });
  } catch (err) {
    console.log(err);
  }
};
