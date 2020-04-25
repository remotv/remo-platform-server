/**
 * Input Required:
 *    @param {string} name
 *    @param {string} server_id
 *
 * Notes:
 *    - Controls will automatically be generated for a new channel
 *    - Currently only one chat_id per server
 */

module.exports = async (data) => {
  const { saveRobotChannel } = require("../../models/robotChannels");
  const { checkName } = require(".");

  console.log("Make Robot Channel: ", data);

  //ensure data:
  if (!data.name || data.server_id)
    return { error: "name & server_id required" };
  const checkChannelName = await checkName(data);
  if (checkChannelName.error) return checkChannelName;

  console.log("Generating Channel For: ", data.name);
  const generate = generateChannel(data);
  if (!generate) return { error: "problem creating channel" };

  console.log("Saving Channel: ", generate.name);
  const save = await saveRobotChannel(generate);
  console.log("Save Complete");
  return save;
};

const generateChannel = async ({ name, server_id, chat_id, controls_id }) => {
  const { getChatRooms } = require("../../models/chatRoom");
  const { createControls } = require("../../models/controls");
  const uuidv4 = require("uuid/v4");

  //get reference id's, controls will always be generated for a new channel
  chat_id = chat_id || (await getChatRooms(data.server_id)[0].id);
  controls_id = controls_id || (await createControls({ channel_id: data.id }));

  if (!chat_id || controls_id) return null;

  return {
    name: name,
    id: "rbot-" + uuidv4(),
    created: Date.now(),
    heartbeat: 0,
    server_id: server_id,
    controls_id: controls_id,
    chat_id: chat_id,
  };
};
