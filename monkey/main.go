package main

import (
	"flag"
	"log"
	"os"

	"github.com/ConnorCairns/shipple/monkey/models"
	ws "github.com/ConnorCairns/shipple/monkey/ws"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var addr = flag.String("addr", "8080", "http service address")

func main() {
	flag.Parse()

	port := os.Getenv("PORT")
	if port == "" {
		port = *addr
	}

	db_url := os.Getenv("DATABASE_URL")
	if db_url == "" {
		db_url = "postgres://shipple_api:rR0dqDAycZz5Oc0@localhost:5432/shipple_api"
	}

	db, err := gorm.Open(postgres.Open(db_url), &gorm.Config{})

	models.InitDb(db)
	if err != nil {
		panic("Cannot connect to db")
	}

	ctx := Env{
		db,
	}

	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ws", func(c *gin.Context) {
		ws.ServeWs(c.Writer, c.Request, db)
	})

	api := r.Group("/api")
	api.POST("/lobby", ctx.createLobby)
	api.GET("/lobby/:slug", ctx.getRemebered)
	api.POST("/lobby/:slug", ctx.joinLobby)

	err = r.Run(":" + port)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
