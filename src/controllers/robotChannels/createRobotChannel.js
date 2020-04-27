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
  const { authMemberRole } = require("../roles");
  const { checkName, log, updateChannelsOnServer } = require("./");

  try {
    log(`Create Robot Channel: 
  name: ${data.name}, 
  server: ${data.server_id}`);

    //ensure data:
    if (!data.name || !data.server_id)
      return { error: "name & server_id required" };

    //auth user to make channel
    const auth = await authMemberRole(data.user_id, data.server_id);
    if (!auth) return { error: "You are not authorized to make this request" };

    //validate Name
    const checkChannelName = await checkName(data);
    if (checkChannelName.error) return checkChannelName;

    //generate channel
    const generate = await generateChannel(data);
    if (!generate) return { error: "problem creating channel" };

    //save, return, and broadcast update event for channel
    const save = await saveRobotChannel(generate);
    if (save) updateChannelsOnServer(data.server_id);
    log(`Channel ${save.name},
    ${save.id},
     created successfully.\n`);

    return save;
  } catch (err) {
    console.log(err);
    return { error: "The server encountered a problem creating a channel." };
  }
};

const generateChannel = async ({ name, server_id, chat_id, controls_id }) => {
  const { getChatRooms } = require("../../models/chatRoom");
  const { createControls } = require("../../models/controls");
  const uuidv4 = require("uuid/v4");

  try {
    //input required!
    if (!name || !server_id) return null;
    const id = "rbot-" + uuidv4();

    //get chat id if not included
    if (!chat_id) {
      let getChatId = await getChatRooms(server_id);
      chat_id = getChatId[0].id;
    }

    //generate controls if no controls_id included
    if (!controls_id) {
      let getControlsId = await createControls({ channel_id: id });
      controls_id = getControlsId.id;
    }

    //get reference id's, controls will always be generated for a new channel
    if (!chat_id || !controls_id) return null;

    return {
      name: name,
      id: id,
      created: Date.now(),
      heartbeat: 0,
      server_id: server_id,
      controls_id: controls_id,
      chat_id: chat_id,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
