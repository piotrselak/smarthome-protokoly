package main

import (
	"context"
	"github.com/go-chi/cors"
	"github.com/piotrselak/smarthome-protokoly/server/user"
	"net/http"

	"github.com/piotrselak/smarthome-protokoly/server/pkg/db"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	client := db.Init("mongodb://localhost:27017")
	database := client.Database("smarthome")
	userCollection := database.Collection("user")
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("welcome"))
	})

	// Important! Admin creates user (eg. landlord)
	r.Route("/user", func(r chi.Router) {
		r.Use(user.AuthCtx)
		r.Post("/", user.SignIn(userCollection))
	})

	r.Route("/room", func(r chi.Router) {
		//r.Get("/")
	})

	_ = http.ListenAndServe(":3000", r)
}
