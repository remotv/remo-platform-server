module.exports = async () => {
  const s3 = require("../../services/s3");
  try {
    await s3.listBuckets({}, function (err, data) {
      if (err) console.log(err, err.stack);
      else {
        data["Buckets"].forEach(function (space) {
          console.log(space["Name"]);
        });
      }
      return null;
    });
  } catch (err) {
    console.log(err);
  }
};
