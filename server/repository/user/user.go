package user

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func FetchUser(coll *mongo.Collection, userId string) (bson.M, error) {
	var result bson.M
	err := coll.FindOne(context.Background(),
		bson.D{{"id", userId}}).Decode(&result)

	if err == mongo.ErrNoDocuments {
		return nil, errors.New("No document was found")
	} else if err != nil {
		panic(err)
	}

	return result, nil
}
