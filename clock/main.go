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
	Value string
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
	opts.SetClientID("clock-" + room)
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
		currTime := time.Now()
		data := Data{Room: room, Component: "Clock", Value: currTime.String()}
		messageJSON, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}
		fmt.Println(string(messageJSON))
		token = client.Publish("output", 0, false, messageJSON)
		token.Wait()
		time.Sleep(1 * time.Second)
	}
}
