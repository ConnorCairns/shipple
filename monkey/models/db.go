package models

import "gorm.io/gorm"

func InitDb(db *gorm.DB) {
	db.AutoMigrate(&Guest{}, &Lobby{}, &Location{})
}
