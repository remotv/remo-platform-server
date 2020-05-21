module.exports = (ws, channel_id) => {
  if (ws.robot) ws.channel_id = ws.robot.id;
  //Not really needed for robots
  else ws.channel_id = channel_id;
};
