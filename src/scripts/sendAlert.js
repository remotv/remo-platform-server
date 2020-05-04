const send = async () => {
  const axios = require("axios");
  const { internalKey, sendAlert } = require("../config");
  const { makeId, createTimeStamp } = require("../modules/utilities");
  const { createInternalAuth } = require("../modules/jwt");

  const token = await createInternalAuth(`priv-${internalKey}`);
  console.log("Token: ", token);

  const message = {
    message: process.argv.slice(2).join(" "),
    sender: "System Alert",
    type: "alert",
    broadcast: "",
    display_message: true,
    id: `mesg-${makeId()}`,
    time_stamp: createTimeStamp(),
  };

  console.log("Sending Message: ", message);

  await axios
    .post(
      "http://localhost:3231/internal/api/send-alert",
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
