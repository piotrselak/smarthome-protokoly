package user

import (
	"encoding/json"
	"net/http"

	"github.com/piotrselak/smarthome-protokoly/server/domain/user"
	"github.com/piotrselak/smarthome-protokoly/server/modules/auth"
	user2 "github.com/piotrselak/smarthome-protokoly/server/repository/user"
	"go.mongodb.org/mongo-driver/mongo"
)

func SignIn(coll *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestUser user.User
		jsonDecoder := json.NewDecoder(r.Body)
		if err := jsonDecoder.Decode(&requestUser); err != nil {
			errMsg, _ := json.Marshal([]byte("Invalid body."))
			w.WriteHeader(400)
			w.Write(errMsg)
			return
		}

		result, err := user2.FetchUser(coll, requestUser.Id)
		if err != nil {
			errMsg, _ := json.Marshal("User not found")
			w.WriteHeader(404)
			w.Write(errMsg)
		}

		jsonData, err := json.MarshalIndent(result, "", "    ")
		if err != nil {
			panic(err)
		}
		var user user.User
		_ = json.Unmarshal(jsonData, &user)

		if user.Hash == requestUser.Hash {
			jwt, _ := auth.GenerateJWT(user.Id)
			jwtJson, _ := json.Marshal(jwt)
			w.Write(jwtJson)
		} else {
			errMsg, _ := json.Marshal("Unauthorized")
			w.WriteHeader(401)
			w.Write(errMsg)
		}
	}
}
