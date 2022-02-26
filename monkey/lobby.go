package main

import (
	"bytes"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"

	"github.com/ConnorCairns/shipple/monkey/models"
	"github.com/gin-gonic/gin"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func (e *Env) createLobby(c *gin.Context) {
	var lobby models.Lobby

	c.ShouldBindJSON(&lobby)

	lobby.Slug = randString(6)

	result := e.db.Create(&lobby)

	if result.Error == nil {
		c.JSON(200, gin.H{
			"lobby_id": lobby.Slug,
		})
	} else {
		c.JSON(500, gin.H{
			"error": "something terrible",
		})
	}
}

func (e *Env) getRemebered(c *gin.Context) {
	var lobby models.Lobby
	var guest models.Guest
	cookie, remembered := c.Params.Get("remember")

	if !remembered {
		c.JSON(http.StatusNotFound, gin.H{"error": "cookie not found"})
		return
	}

	if err := e.db.Where("slug = ?", c.Param("slug")).First(&lobby).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "room not found!"})
		return
	}

	if err := e.db.Where("remember_cookie = ? AND lobby_id = ?", cookie, lobby.ID).First(&guest).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "cookie not found"})
		return
	}

	c.JSON(200, lobby)
}

func (e *Env) joinLobby(c *gin.Context) {
	var lobby models.Lobby
	var guest models.Guest
	cookie, remembered := c.Params.Get("remember")

	if err := e.db.Where("slug = ?", c.Param("slug")).First(&lobby).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "room not found!"})
		return
	}

	c.ShouldBindJSON(&guest)

	if remembered {
		guest.Remember_cookie = cookie
	} else {
		guest.Remember_cookie = randString(64)
	}

	c.JSON(200, gin.H{"lobby": lobby, "me": guest})
}

func (e *Env) calcCrawl(c *gin.Context) {
	var lobby models.Lobby
	remoteUrl := os.Getenv("ML_URL") + "/api/fucktom"

	if err := e.db.Where("slug = ?", c.Param("slug")).First(&lobby).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "room not found!"})
		return
	}

	number_of_coords := (len(lobby.Guests) * 2) + 2

	all_coords := make([]float64, number_of_coords)

	for i := 0; i < number_of_coords-2; i += 2 {
		all_coords[i] = lobby.Guests[i].LastKnownLocation.Latitude
		all_coords[i+1] = lobby.Guests[i].LastKnownLocation.Latitude
	}

	postBody, err := json.Marshal(all_coords)
	responseBody := bytes.NewBuffer(postBody)

	resp, err := http.Post(remoteUrl, "application/json", responseBody)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()
	if err != nil {
		panic("Oh no")
		return
	}

	new_headers := make(map[string]string, 0)

	c.DataFromReader(200, resp.ContentLength, "application/json", resp.Body, new_headers)
	return
}

func randString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}
