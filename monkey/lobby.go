package main

import (
	"math/rand"
	"net/http"

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

func (e *Env) getLobby(c *gin.Context) {
	var lobby models.Lobby

	if err := e.db.Where("slug = ?", c.Param("slug")).First(&lobby).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(200, lobby)
}

func randString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}
