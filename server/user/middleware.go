package user

import (
	"context"
	"github.com/golang-jwt/jwt"
	"net/http"
)

func AuthCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Token"] != nil {
			token, err := jwt.Parse(r.Header["Token"][0], func(token *jwt.Token) (interface{}, error) {
				_, ok := token.Method.(*jwt.SigningMethodRSA)
				if !ok {
					w.WriteHeader(http.StatusUnauthorized)
					_, err := w.Write([]byte("Unauthorized"))
					if err != nil {
						return nil, err
					}
				}
				return "", nil
			})
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				_, err2 := w.Write([]byte("You're Unauthorized due to error parsing the JWT"))
				if err2 != nil {
					return
				}
			}
			if token.Valid {
				ctx := context.WithValue(r.Context(), "token", token)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				w.WriteHeader(http.StatusUnauthorized)
				_, err := w.Write([]byte("You're Unauthorized due to invalid token"))
				if err != nil {
					return
				}
			}
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			_, err := w.Write([]byte("You're Unauthorized due to No token in the header"))
			if err != nil {
				return
			}
		}
	})
}
