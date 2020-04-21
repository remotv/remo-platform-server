/**
 *   Purpose: Keep data structures intact for old API endpoints as I refactor
 */

// api/v1 to api/dev data adapter
module.exports = (data) => {
  if (data.chat_id && data.chat_id) data.chat = data.chat_id;
  if (data.type && data.type === robot_server) data.server_id = data.id;

  return data;
};
