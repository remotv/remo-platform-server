module.exports = () => {
  const { makeId } = require("../../modules/utilities");
  const exampleControls = [
    { break: "line", label: "movement" },
    { label: "forward", hot_key: "w", command: "f" },
    { label: "back", hot_key: "s", command: "b" },
    { label: "left", hot_key: "a", command: "l" },
    { label: "right", hot_key: "d", command: "r" },
    { break: "line", label: "" },
    {
      label: "example admin command",
      command: "example",
      access: "owner"
    }
    // {
    //   label: "example timer",
    //   command: "timer-example",
    //   cooldown: 100
    // }
  ];

  let exportExample = [];
  exampleControls.forEach(button => {
    button.id = `bttn-${makeId()}`;
    exportExample.push(button);
  });

  return exportExample;
};
