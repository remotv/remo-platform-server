/**
 * CONFIG README: 
 * This file contains defaults for various values used by this application
 * Some values are left blank because they contain sensitive information
 * 
 * overrides.js should be untracked by git, and export a javascript object w/ key value pairs
 * Any key value pairs written in overrides will overwrite the ones here if using the same key 
 * Use overrides to store secret keys and other sensitive information you don't want committed to a public repo
 */

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
  maxButtons: 96,

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

  /**
   * PATREON STUFF:
   * Values for creatorAccessToken and creatorRefreshToken will be intilized from here, but will be managed in the DB after that. 
   * Scripts for initializing and updating the values from the config to the db can be found ...
   * in src/scripts/patreon 
   * The init script needs to be run at least once ( with correct config settings ) before Patreon integration will work */
  
  patreonClientID:
    "qzqYm-sCfZsMr-Va7LoFGRsNPBPO_bNb_TpLbxCOLSRVod_4t7sI2ezCVu3VMQ7o",
  patreonClientSecret: "",
  creatorAccessToken: "", //used to init patreon_access_token in DB / internal_store
  creatorRefreshToken: "", //used to init patreon_refresh_token in DB / internal_store
  campaignId: "3356897",
  patreonSyncInterval: 30000,
  autoPatreonTokenRefresh: false, //Automatically refresh Patreon Client Access Token ( best to disable for local development )
  patreonRefreshTokenInterval: 1000 * 60 * 60 * 24 * 7, //once a week

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
