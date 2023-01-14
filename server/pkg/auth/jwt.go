package auth

import (
	"crypto/rand"
	"crypto/rsa"
	"time"

	"github.com/golang-jwt/jwt"
)

var (
	PrivateToken, _ = generateRsaKeyPair()
)

func GenerateJWT(userID string, perm int) (string, error) {
	token := jwt.New(jwt.SigningMethodRS512)

	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(2 * time.Hour)
	claims["authorized"] = true
	claims["userID"] = userID
	claims["perm"] = perm // 0 or 1

	tokenString, err := token.SignedString(PrivateToken)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Used for simplicity - backend will be started once.
func generateRsaKeyPair() (*rsa.PrivateKey, *rsa.PublicKey) {
	privkey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}
	return privkey, &privkey.PublicKey
}
