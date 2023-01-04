package main

import (
	"github.com/piotrselak/smarthome-protokoly/server/handlers/user"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
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
		r.Post("/", user.SignIn)
	})

	http.ListenAndServe(":3000", r)
}
