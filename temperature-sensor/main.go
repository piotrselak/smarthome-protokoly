package main

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"os"
	"time"
)

type Data struct {
	Temperature float32
}

var temperature float32 = 24.0

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
	var response Data

	if err := json.Unmarshal(msg.Payload(), &response); err != nil {
		panic(err)
	}
	temp := response.Temperature
	temperature = temp
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
	opts.SetClientID("temp-sensor-" + room)
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	token := client.Subscribe("topic/temperature-in-"+room, 1, nil)
	token.Wait()
	fmt.Printf("Subscribed to topic %s\n", "topic/temperature-out-in-"+room)

	for {
		data := Data{Temperature: temperature}
		messageJSON, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}

		token = client.Publish("topic/temperature-out-"+room, 0, false, messageJSON)
		token.Wait()
		time.Sleep(5 * time.Second)
	}
}
