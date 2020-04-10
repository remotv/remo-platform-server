//input: { label: "<string>", hot_key: "<string>", command: "<string>"}
//output: array of button objects w/ id generated per button
module.exports = async (buttons, channel_id, controls_id) => {
  const { jsonError } = require("../../modules/logging");
  const { updateControls } = require("../../models/controls");
  const { validateButtonsJSON, validateButton } = require("./../validate");
  const { makeId } = require("../../modules/utilities");
  let response = {};
  let newButtons = [];
  let buildControls = {};
  buildControls.channel_id = channel_id;
  buildControls.id = controls_id;
  let foundError = false;
  let errorData = {};
  //generate json

  try {
    if (buttons) {
      const checkButtonsArray = validateButtonsJSON(buttons);
      if (checkButtonsArray.error) return checkButtonsArray;
      buttons.forEach(button => {
        let newButton = {};
        newButton.id = `bttn-${makeId()}`;

        //only save valid key / value pairs

        //required:
        if (!foundError && (button.label || button.label === "")) {
          newButton.label = validateButton({
            input: button.label,
            max: 256,
            label: "Button Label",
            notRequired: true
          });
          if (newButton.label.error) {
            foundError = true;
            errorData = newButton.label;
            return errorData;
          }
        } else {
          //Dont publish invalid button
          return;
        }

        if (button.break) {
          newButton.break = button.break;
          newButtons.push(newButton);
          return;
        }

        if (!foundError && button.command) {
          newButton.command = validateButton({
            input: button.command,
            label: "Button Command"
          });
          if (newButton.command.error) {
            foundError = true;
            errorData = newButton.command.error;
            return errorData;
          }
        } else {
          //Dont publish invalid button
          return;
        }

        //optional
        if (!foundError && button.hot_key) {
          newButton.hot_key = validateButton({
            input: button.hot_key,
            label: "hot-key",
            max: 16
          });
          if (newButton.hot_key.error) {
            foundError = true;
            errorData = newButton.hot_key;
            return errorData;
          }
        }

        if (!foundError && (button.cooldown || button.cooldown === 0)) {
          newButton.cooldown = button.cooldown;
          const checkInt = Number.isInteger(newButton.cooldown);
          if (!checkInt)
            newButton.cooldown = jsonError(
              "Cooldown must be a single whole number ( integer )."
            );
          if (button.cooldown > 99999 || button.cooldown < 1)
            newButton.cooldown = jsonError(
              "Cooldown cannot be over 5 digits in length, or less than 1."
            );
          console.log("Cooldown Result: ", newButton);
          if (newButton.cooldown.error) {
            console.log("Error Detected");
            foundError = true;
            errorData = newButton.cooldown;
            return errorData;
          }
        }

        if (!foundError && button.access) {
          newButton.access = validateButton({
            input: button.access,
            label: "Access Level"
          });
          if (newButton.access.error) {
            foundError = true;
            errorData = newButton.access;
            return errorData;
          }
        }

        if (!foundError && button.disabled) {
          newButton.disabled = true;
        }

        newButtons.push(newButton);
      });
    } else {
      return jsonError("invalid data to generate buttons");
    }
  } catch (err) {
    return jsonError("Problem generating buttons from input data");
  }

  if (foundError && errorData) return errorData;

  buildControls.buttons = newButtons;
  generateControls = await updateControls(buildControls);
  if (generateControls) {
    response.status = "success";
    response.result = generateControls;
    return response;
  }
  response.status = "error";
  response.error = "problem build buttons (controls.js/buildButtons)";
  return response;
};
