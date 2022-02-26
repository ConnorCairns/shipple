package models

import "gorm.io/gorm"

type Guest struct {
	gorm.Model
	Name string

	WalkingTime       int
	Remember_cookie   string
	LastKnownLocation Location

	LobbyID uint
}
