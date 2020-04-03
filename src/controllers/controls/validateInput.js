module.exports = async input => {
  const { getControls } = require("../../models/controls");
  const { testControls } = require("./");
  const { pushButtonTimer } = require("./buttonTimers");
  const { authLocal } = require("../roles");
  // console.log("VALIDATE INPUT: ", input);
  let response = {}; //response object
  let validate = false; //direct input validation
  let authAccess = false; //validate input with restricted access

  if (input.button.access) {
    const auth = await authLocal(input.user, { server_id: input.server });
    if (auth.authorized) authAccess = true;
  }

  const checkInput = await getControls(input.controls_id, input.channel);

  if (checkInput && checkInput.buttons) {
    checkInput.buttons.map(button => {
      if (
        (button.id === input.button.id && !button.access) ||
        (button.id === input.button.id && button.access && authAccess)
      ) {
        validate = true;
        if (button.cooldown) pushButtonTimer(button);
      }
    });
  } else {
    console.log(
      "No buttons found, validating against default controls instead"
    );
    testControls.map(button => {
      if (button.label === input.button.label) validate = true;
    });
  }

  if (validate) response.validated = true;
  if (!validate) response.validated = false;
  // console.log("Validation Result: ", response.validated);
  return response;
};
