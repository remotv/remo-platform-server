module.exports = () => {
  return [
    { break: "line", label: "movement", id: "1" },
    { label: "forward", hot_key: "w", command: "f", id: "2" },
    { label: "back", hot_key: "s", command: "b", id: "3" },
    { label: "left", hot_key: "a", command: "l", id: "4" },
    { label: "right", hot_key: "d", command: "r", id: "5" },
    { break: "line", label: "", id: "6" },
    {
      label: "example admin command",
      command: "example",
      access: "owner",
      id: "7"
    },
    {
      label: "example timer",
      command: "timer-example",
      id: "8",
      cooldown: 100
    }
  ];
};
