package main

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"os"
	"time"
)

type Data struct {
	Room string
	Component string
	Value bool
}

var isClosed bool = true

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
	var response Data

	if err := json.Unmarshal(msg.Payload(), &response); err != nil {
		panic(err)
	}

	if response.Room == os.Getenv("ROOM") && response.Component == "Set-shutter" {
		isClosed = response.Value
	}
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
}

func main() {
	room := os.Getenv("ROOM")
	var broker = "tcp://mqtt:1883"

	opts := mqtt.NewClientOptions()
	opts.AddBroker(broker)
	opts.SetClientID("window-shutter-" + room)
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	token := client.Subscribe(room, 1, nil)
	token.Wait()
	fmt.Printf("Subscribed to topic %s\n", room)

	for {
		data := Data{Room: room, Component: "Shutter", Value: isClosed}
		messageJSON, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}
		fmt.Println(string(messageJSON))
		token = client.Publish("output", 0, false, messageJSON)
		token.Wait()
		time.Sleep(4 * time.Second)
	}
}
