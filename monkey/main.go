package main

import (
	"flag"
	"log"

	ws "github.com/ConnorCairns/shipple/monkey/ws"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()

	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ws", func(c *gin.Context) {
		ws.ServeWs(c.Writer, c.Request)
	})

	api := r.Group("/api")
	api.POST("/lobby", createLobby)

	err := r.Run(*addr)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
