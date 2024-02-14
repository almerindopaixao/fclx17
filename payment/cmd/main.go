package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/almerindopaixao/fclx17/payment/internal/entity"
	"github.com/almerindopaixao/fclx17/payment/pkg/rabbitmq"
	amqp "github.com/rabbitmq/amqp091-go"
)

// {"order_id": "123", "card_hash": "123", "total": 100.00}
func main() {
	ctx := context.Background()
	ch, err := rabbitmq.OpenChannel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	msgs := make(chan amqp.Delivery)
	go rabbitmq.Consume(ch, msgs, "orders")

	for msg := range msgs {
		var orderRequest entity.OrderRequest
		err := json.Unmarshal(msg.Body, &orderRequest)
		if err != nil {
			fmt.Println(err.Error())
			break
		}
		response, err := orderRequest.Process()
		if err != nil {
			fmt.Println(err.Error())
			break
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err.Error())
			break
		}

		err = rabbitmq.Publish(ctx, ch, string(responseJSON), "amq.direct", "PaymentDone")
		if err != nil {
			fmt.Println(err.Error())
			break
		}

		msg.Ack(false)
		fmt.Printf("Order %s processed\n", orderRequest.OrderID)
	}
}
