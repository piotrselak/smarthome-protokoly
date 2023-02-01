const WebSocket = require("ws");
const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 11111 });

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt:1883");

const data = {};

// Websocket
wss.on("connection", function connection(ws) {
  console.log("Connected ws");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const stringData = data.toString();

    if (stringData.match(/Set-temperature/)) {
      const jsonData = JSON.parse(stringData);
      client.publish(jsonData.Room, stringData);
      console.log("set temperature");
    } else if (stringData.match(/Set-shutter/)) {
      const jsonData = JSON.parse(stringData);
      client.publish(jsonData.Room, stringData);
      console.log("set shutter");
    } else if (stringData.match(/room/)) {
      console.log("new connection: %s", stringData);
      ws.id = stringData;
    }
  });

  setInterval(() => {
    wss.clients.forEach((c) => {
      c.send(JSON.stringify(data[c.id]));
    });
  }, 200);
});

// Mqtt;
client.on("connect", function () {
  console.log("Connected mqtt");
  client.subscribe("output", function (err) {
    if (!err) {
      console.log(`Listening on topic: output`);
    }
  });
});

client.on("message", function (topic, message) {
  const parsed = JSON.parse(message.toString());
  if (!data[parsed.Room]) data[parsed.Room] = {};
  console.log(parsed);
  data[parsed.Room][parsed.Component] = parsed.Value;
});
