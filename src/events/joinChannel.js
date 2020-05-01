module.exports = (ws, channel_id) => {
  if (ws.robot) ws.channel_id = robot.id;
  else ws.channel_id = channel_id;
};
