package user

import (
	"encoding/json"
	"fmt"
	"github.com/piotrselak/smarthome-protokoly/server/domain"
	"github.com/piotrselak/smarthome-protokoly/server/pkg/auth"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"
)

func SignIn(coll *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestUser domain.User
		jsonDecoder := json.NewDecoder(r.Body)
		if err := jsonDecoder.Decode(&requestUser); err != nil {
			errMsg, _ := json.Marshal([]byte("Invalid body."))
			w.WriteHeader(http.StatusBadRequest)
			w.Write(errMsg)
			return
		}

		result, err := fetchUser(coll, requestUser.Id)
		if err != nil {
			errMsg, _ := json.Marshal("User not found")
			w.WriteHeader(http.StatusNotFound)
			w.Write(errMsg)
			return
		}

		jsonData, err := json.MarshalIndent(result, "", "    ")
		if err != nil {
			panic(err) // change it
		}
		var user domain.User
		_ = json.Unmarshal(jsonData, &user)

		if user.Hash == requestUser.Hash {
			jwt, err := auth.GenerateJWT(user.Id, user.Perm)
			if err != nil {
				errMsg, _ := json.Marshal("Server couldn't generate jwt. Internal server error.")
				w.WriteHeader(http.StatusInternalServerError)
				w.Write(errMsg)
				fmt.Println(err)
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(jwt))
		} else {
			errMsg, _ := json.Marshal("Unauthorized")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(errMsg)
		}
	}
}
