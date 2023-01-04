package user

import (
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

func SignIn(coll *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
