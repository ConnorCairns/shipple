// The web ctx
package main

import "gorm.io/gorm"

type Env struct {
	db *gorm.DB
}
