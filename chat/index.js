const WebSocket = require("ws");
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 11112 });

// Websocket
wss.on("connection", function connection(ws) {
  console.log("Connected ws");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const stringData = data.toString();

    wss.clients.forEach((c) => {
      console.log(stringData);
      c.send(stringData);
    });
  });
});
