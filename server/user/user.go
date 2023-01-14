package user

import (
	"encoding/json"
	"github.com/piotrselak/smarthome-protokoly/server/domain"
	"net/http"

	"github.com/piotrselak/smarthome-protokoly/server/pkg/auth"
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
		}

		jsonData, err := json.MarshalIndent(result, "", "    ")
		if err != nil {
			panic(err)
		}
		var user domain.User
		_ = json.Unmarshal(jsonData, &user)

		if user.Hash == requestUser.Hash {
			jwt, _ := auth.GenerateJWT(user.Id, user.Perm)
			jwtJson, _ := json.Marshal(jwt)
			w.Write(jwtJson)
		} else {
			errMsg, _ := json.Marshal("Unauthorized")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write(errMsg)
		}
	}
}