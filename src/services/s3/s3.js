const AWS = require("aws-sdk");
const { s3Public, s3Private, s3Url } = require("../../config");
const spacesEndpoint = new AWS.Endpoint(s3Url);
const s3Config = {
  endpoint: spacesEndpoint,
  accessKeyId: s3Public,
  secretAccessKey: s3Private,
};

const s3 = new AWS.S3(s3Config);

module.exports = s3;
