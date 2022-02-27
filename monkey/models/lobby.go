package models

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Lobby struct {
	gorm.Model
	Name          string
	ScheduledTime int64
	Slug          string `gorm:"uniqueIndex"`

	Admin  Guest
	Guests []Guest
}

func CalculateCrawl(path string, db *gorm.DB) []byte {
	var lobby Lobby
	remoteUrl := "https://shipple-ml.fly.dev" + "/api/v1/chuckle_brothers"

	if err := db.Preload("Admin.LastKnownLocation").Preload("Guests.LastKnownLocation").Preload(clause.Associations).Where("slug = ?", path).First(&lobby).Error; err != nil {
		log.Println("Could not find room")
		return nil
	}

	log.Println(len(lobby.Guests))
	number_of_coords := (len(lobby.Guests) * 2)

	all_coords := make([]float64, 0, number_of_coords)

	log.Println(number_of_coords)

	// for i := 0; i < number_of_coords-1; i += 1 {
	// 	all_coords[i] = lobby.Guests[i].LastKnownLocation.Latitude
	// 	all_coords[i+1] = lobby.Guests[i].LastKnownLocation.Longitude
	// }

	//Tom was overwriting here, shits fucked
	for i := 0; i < len(lobby.Guests); i +=1 {
		all_coords = append(all_coords, lobby.Guests[i].LastKnownLocation.Latitude, lobby.Guests[i].LastKnownLocation.Longitude)
	}

	log.Println(all_coords)

	postBody, err := json.Marshal(gin.H{"coords": all_coords})
	responseBody := bytes.NewBuffer(postBody)

	log.Println("Making req")
	resp, err := http.Post(remoteUrl, "application/json", responseBody)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()
	if err != nil {
		panic("Oh no")
	}

	rawContent, err := ioutil.ReadAll(resp.Body)


	if err != nil {
		panic(err)
	}

	return rawContent
}
