const send = async () => {
  const axios = require("axios");
  const { internalKey, sendAlert } = require("../config");
  const { createInternalToken } = require("../controllers/auth");

  //Generate Auth Token to send message
  const token = await createInternalToken(`priv-${internalKey}`);
  if (!token) return console.log("Unable to generate token");

  //parse input for message
  const message = process.argv.slice(2).join(" ");
  console.log("Sending Message: ", message);

  //send global chat message to all of remo
  await axios
    .post(
      sendAlert,
      {
        alert: message,
      },
      {
        headers: { authorization: `Bearer ${token}` },
      }
    )
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });

  console.log("Send Alert Complete!");
  process.exit();
};

send();
