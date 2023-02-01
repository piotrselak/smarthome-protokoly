const WebSocket = require('ws');
const {WebSocketServer} = require("ws");

const wss = new WebSocketServer({port: 11111});

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://localhost:1883')

wss.on('connection', function connection(ws) {
    console.log("Connected ws")

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});


client.on('connect', function () {
    console.log("Connected mqtt")
    client.subscribe('presence', function (err) {
        if (!err) {
            client.publish('presence', 'Hello mqtt')
        }
    })
})

// client.on('message', function (topic, message) {
//     // message is Buffer
//     console.log(message.toString())
//     client.end()
// })

