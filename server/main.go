package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/piotrselak/smarthome-protokoly/server/handlers/user"
	"github.com/piotrselak/smarthome-protokoly/server/modules/db"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Print("Error loading .env file")
	}

	client := db.Init("localhost:27017")
	database := client.Database("smarthome")
	userCollection := database.Collection("user")
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})

	// Important! Admin creates user (eg. landlord)
	r.Route("/user", func(r chi.Router) {
		r.Post("/", user.SignIn(userCollection))
	})

	http.ListenAndServe(":3000", r)
}
