// const { test } = require("../controllers/robotChannels/checkName");
const {
  test__deleteRobotChannel,
} = require("../models/robotChannels/deleteRobotChannel");

const doTest = async () => {
  try {
    const testDelete = await test__deleteRobotChannel(null);
    console.log(testDelete);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
doTest();
