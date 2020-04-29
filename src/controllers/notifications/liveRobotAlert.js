module.exports = async (robot) => {
  const { getRobotChannelById } = require("../../models/robotChannels");
  const { createMessage } = require("../../models/chatMessage");
  const { robotAlerts } = require("./");
  const {
    getRobotServer,
    updateRobotServerStatus,
  } = require("../../models/robotServer");
  const { notifyFollowers } = require("./");
  const { emailNotificationInterval } = require("../../config");

  let { settings, status, server_name, owner_id } = await getRobotServer(
    robot.server_id
  );

  //TODO: Setting specifically for annoucing live robots in chat
  if (settings.announce_followers_in_chat !== false) {
    const alertMessage = robotAlerts(robot.name);
    createMessage({
      message: alertMessage,
      user: robot,
      server_id: robot.server_id,
      type: "event",
      broadcast: "server",
    });
  }

  const time = Date.now();
  // console.log("GETTING READY TO SEND NOTIFICATION!, ");
  // if (status.notification_sent)
  //   console.log(
  //     "Interval: ",
  //     emailNotificationInterval,
  //     "Notification Sent + Interval: ",
  //     status.notification_sent + emailNotificationInterval,
  //     "Current Time: ",
  //     time
  //   );

  if (
    !status.notification_sent ||
    time > status.notification_sent + emailNotificationInterval
  ) {
    const getRobot = await getRobotChannelById(robot.id);

    const linkChannel = getRobot.id || settings.default_channel;
    notifyFollowers(
      robot.server_id,
      server_name,
      linkChannel,
      robot.name,
      owner_id
    );
    status.notification_sent = time;
    updateRobotServerStatus(robot.server_id, status);
  } else {
    // console.log("NOTIFICATION NOT SENT!");
  }
};
