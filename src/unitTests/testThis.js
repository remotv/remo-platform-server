const { test } = require("../controllers/robotChannels/checkName");
const doTest = async () => {
  try {
    const testThis = await test({ name: "", server_id: "" });
    console.log(testThis);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
doTest();
