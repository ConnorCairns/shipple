package models

import (
	"gorm.io/gorm"
)

type Lobby struct {
	gorm.Model
	Name          string
	ScheduledTime int64
	Slug          string `gorm:"uniqueIndex"`

	Admin  Guest
	Guests []Guest
}
