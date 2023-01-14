package auth

import (
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateJWT(userID string, perm int) (string, error) {
	key := "super-secret-key"
	token := jwt.New(jwt.SigningMethodEdDSA)

	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(2 * time.Hour)
	claims["authorized"] = true
	claims["userID"] = userID
	claims["perm"] = perm // 0 or 1

	tokenString, err := token.SignedString(key)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
