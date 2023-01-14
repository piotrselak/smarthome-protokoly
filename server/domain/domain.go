package domain

type User struct {
	Id   string `json:"_id"`
	Hash string `json:"hash"`
	Perm int    `json:"perm"`
}
