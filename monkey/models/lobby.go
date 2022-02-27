package models

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

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

func CalculateCrawl(path string, db *gorm.DB) []byte {
	var lobby Lobby
	remoteUrl := "https://shipple-ml.fly.dev" + "/api/v1/chuckle_brothers"

	if err := db.Where("slug = ?", path).First(&lobby).Error; err != nil {
		log.Println("Could not find room")
		return nil
	}

	number_of_coords := (len(lobby.Guests) * 2)

	all_coords := make([]float64, number_of_coords)

	for i := 0; i < number_of_coords; i += 2 {
		all_coords[i] = lobby.Guests[i].LastKnownLocation.Latitude
		all_coords[i+1] = lobby.Guests[i].LastKnownLocation.Latitude
	}

	log.Println("Made coords")

	postBody, err := json.Marshal(all_coords)
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
