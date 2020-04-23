/**
 * Validate and Authorize input for robot controls:
 * - Once a user passes account and moderation checks, their input is validated against controls stored in DB
 */
module.exports = async (input) => {
  const { getControls } = require("../../models/controls");
  const { testControls } = require("./");
  const { pushButtonTimer } = require("./buttonTimers");
  const { authMemberRole } = require("../roles");

  let response = {}; //return response object
  let validate = false; //validation flag
  let authAccess = false; //restricted access flag

  const isOwner = await authMemberRole(input.user, { server_id: input.server });

  //pretty much validate any input from server owners
  if (isOwner) {
    validate = true;
    authAccess = true;
  }

  //Don't allow use of disabled buttons for normal users
  if (!isOwner && input.button.disabled) return (response.validated = false);

  // Disabling this check for now since we only have owner roles accounted for
  // if (input.button.access ) {
  //   const auth = await authMemberRole(input.user, { server_id: input.server });
  //   if (auth) authAccess = true;
  // }

  //get controls from database
  const checkInput = await getControls(input.controls_id, input.channel);

  //compare input to stored buttons
  if (checkInput && checkInput.buttons) {
    const button = checkInput.buttons.find(
      (checkButton) => checkButton.id === input.button.id
    );

    //Role Check
    if (button && (!button.access || (button.access && authAccess))) {
      //Check button state
      if (button.cooldown) {
        const checkState = await pushButtonTimer(
          button,
          checkInput.channel_id,
          authAccess
        );
        if (checkState && !checkState.disabled) {
          validate = true;
        }
      } else {
        validate = true;
      }
    }
  } else {
    console.log(
      "No buttons found, validating against default controls instead"
    );
    testControls.map((button) => {
      if (button.label === input.button.label) validate = true;
    });
  }

  response.validated = validate;
  return response;
};
