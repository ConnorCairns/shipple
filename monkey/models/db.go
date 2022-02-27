package models

import "gorm.io/gorm"

func InitDb(db *gorm.DB) {
	db.AutoMigrate(Lobby{}, Guest{}, Location{})
}
