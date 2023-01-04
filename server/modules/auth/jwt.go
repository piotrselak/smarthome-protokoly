package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateJWT(userID string) (string, error) {
	key := os.Getenv("SECRET")
	token := jwt.New(jwt.SigningMethodEdDSA)

	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(2 * time.Hour)
	claims["authorized"] = true
	claims["userID"] = userID

	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
