package domain

type User struct {
	Id   string `json:"_id"`
	Hash string `json:"hash"`
	Perm int    `json:"perm"`
}

type UserForAuth struct {
	Id   string `json:"_id"`
	Hash string `json:"hash"`
}

func (u UserForAuth) ToUser(perm int) User {
	return User{
		Id:   u.Id,
		Hash: u.Hash,
		Perm: perm,
	}
}
