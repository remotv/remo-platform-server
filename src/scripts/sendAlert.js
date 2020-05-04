const send = async () => {
  const axios = require("axios");
  const { internalKey, sendAlert } = require("../config");

  const { createInternalAuth } = require("../modules/jwt");

  const token = await createInternalAuth(`priv-${internalKey}`);
  console.log("Token: ", token);

  const message = process.argv.slice(2).join(" ");

  console.log("Sending Message: ", message);

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
