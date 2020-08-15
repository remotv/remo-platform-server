const WebSocket = require("ws");
const { internalKey } = require("../config");
const events = {}; //event: func

ws = new WebSocket(settings.ws_url);
ws.onopen = () => {
  console.log("AUTHENTICATING...");
  ws.send(
    JSON.stringify({
      e: "INTERNAL_LISTENER_AUTHENTICATE",
      d: {
        key: internalKey,
      },
    })
  );
};

ws.onclose = () => {
  console.log("WebSocket closed exiting in 2 seconds");
  setTimeout(() => process.exit(), 2000);
};

ws.onmessage = async((message) => {
  let messageData;
  try {
    messageData = JSON.parse(message);
  } catch (e) {
    return console.log("Malformed Message");
  }

  const event = messageData.e;
  const data = messageData.d;

  if (events.hasOwnProperty(event)) {
    events[event](ws, data);
  } else {
    console.log("Unknown Event: ", event);
  }
});

ws.emitEvent = (event, data) => {
  ws.send(JSON.stringify({ e: event, d: data }));
};

const interval = setInterval(() => {
  const wss = require("../services/wss");
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

function registerEvent(event, func) {
  events[event] = func;
}

registerEvent("TEST_EVENT", () => {
  console.log("TEST EVENT");
});

const sendTestEvent = {};
