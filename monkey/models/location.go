package models

import (
	"gorm.io/gorm"
)

type Location struct {
	gorm.Model

	Longitude float64
	Latitude  float64

	GuestID uint
}
