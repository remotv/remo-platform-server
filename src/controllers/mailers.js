//This is just a straight up link, will make it fancy later

module.exports.emailResetKey = (user, { key_id }) => {
  const { reRouteOutboundEmail } = require("../config/index");
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config");
  const text = `${urlPrefix}recovery/${key_id}`;
  const html = `<a href="${text}">${text}</a>`;
  sendMail({
    to: reRouteOutboundEmail || user.email,
    subject: "Remo.TV - Password Reset Token",
    text: text,
    html: html,
  });
};

module.exports.emailValidationKey = (user, { key_id }) => {
  const { reRouteOutboundEmail } = require("../config/index");
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config");
  const text = `${urlPrefix}validate-email/${key_id}`;
  const html = `<a href="${text}">${text}</a>`;
  sendMail({
    to: reRouteOutboundEmail || user.email,
    subject: "Remo.TV - Please validate your email address.",
    text: text,
    html: html,
  });
};

module.exports.emailLiveRobotAnnoucemnent = (
  user,
  { server_name, channel_id, robotAlert }
) => {
  const {
    reRouteOutboundEmail,
    enableEmailAlerts,
  } = require("../config/index");
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config");
  const text = `${urlPrefix}${server_name}/${channel_id}`;
  const html = `<a href="${text}">${text}</a>`;
  if (enableEmailAlerts === true) {
    sendMail({
      to: reRouteOutboundEmail || user.email,
      subject: `Remo.TV - ${robotAlert}`,
      text: text,
      html: html,
    });
  } else {
    console.log("Email disabled");
  }
};
