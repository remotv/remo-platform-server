const overrides = require("./overrides");

const routePrefix =
  overrides.routePrefix || `http://localhost:3231/internal/api/`;
const defaults = {
  internalKey: undefined, // Undefined for disabled
  serverPort: 3231,
  secret: "temp_secret",
  reCaptchaSecretKey: "",
  maxTimeout: 15768000, //Seconds, not milliseconds
  loadMessages: 25, //number of messages chatroom will get on load
  currentAPIVersion: "/dev",
  logLevel: "debug",
  sendGrid: "",
  sendMail: "",
  enableEmailAlerts: true,
  maxServersPerPage: 50,

  urlPrefix: "https://remo.tv/",
  supportEmail: "jill@remo.tv",
  reRouteOutboundEmail: "",
  autoApproveServerImages: false, //set true for local environment

  //INTERVALS:
  heartBeat: 10000,
  liveStatusInterval: 15000,
  passResetExpires: 900 * 1000, //about 15 minutes (in ms)
  emailValidationExpires: 3600 * 1000 * 24, //24 hours
  authRequestTimeout: 300 * 1000, //5 minutes
  emailNotificationInterval: 3600 * 1000 * 8, //8 Hours
  controlStateUpdateInterval: 200, //This is no longer purely for cleanup,
  serverChatMessageRatelimit: 900, // 1 second with some slack
  imageCleanupInterval: 1000 * 60 * 60 * 24, //cleanup images once a day

  //PATREON STUFF
  patreonClientID:
    "qzqYm-sCfZsMr-Va7LoFGRsNPBPO_bNb_TpLbxCOLSRVod_4t7sI2ezCVu3VMQ7o",
  patreonClientSecret: "",
  creatorAccessToken: "",
  creatorRefreshToken: "",
  campaignId: "3356897",
  patreonSyncInterval: 30000,

  //Internal Routes:
  sendAlert: `${routePrefix}send-alert`,
  testRoute: `${routePrefix}test`,

  db: {
    user: "postgres",
    password: "",
    database: "remote_control",
    host: "localhost",
    port: 5432,
    max: 50,
    idleTimeoutMillis: 30000,
  },

  //S3 Bucket:
  s3Url: "https://sfo2.digitaloceanspaces.com",
  s3Public: "7DLOWTBAYFZMTV3ZMSHL",
  s3Private: "",
  s3Bucket: "remo-image-store",

  //BadWords
  globalBadWordsList: {
    normal_bad_words: {
      //replacement word: [ array, of, bad, word, iterations ]
      example1: ["test1", "test2", "test3"],
      example2: ["word1", "word2", "word3"],
    },
    phonetic_bad_words: {
      //lookup phonetics: https://words.github.io/metaphone/
      // Bad Phonetic Word : Replacement Word
      TST: "example",
    },
  },
  filterWhiteList: [
    "cant",
    "as",
    "count",
    "fact",
    "kind",
    "take",
    "took",
    "dog",
    "duck",
    "fig",
    "neck",
    "pose",
    "piece",
    "pass",
    "shout",
    "sheet",
    "chat",
  ],
};

module.exports = Object.assign({}, defaults, overrides);
