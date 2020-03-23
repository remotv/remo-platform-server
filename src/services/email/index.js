const mail = require("@sendgrid/mail");
const { sendGrid, sendMail } = require("../../config/index");
mail.setApiKey(sendGrid);

module.exports.sendMail = async ({
  to = "",
  sender = sendMail,
  subject = "",
  text = "",
  html = ""
}) => {
  mail.send({
    to: to,
    from: sender,
    subject: subject,
    text: text,
    html: html
  });
  return null;
};
