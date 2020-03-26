module.exports = async input => {
  const { getControls } = require("../../models/controls");
  //console.log("VALIDATE INPUT: ", input);
  let response = {};
  let validate = false;
  const checkInput = await getControls(input.controls_id, input.channel);
  if (checkInput && checkInput.buttons) {
    checkInput.buttons.map(button => {
      if (button.label === input.button.label) validate = true;
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
  console.log("Validation Result: ", response.validated);
  return response;
};
