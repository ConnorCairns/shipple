package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/rs/cors"

	ws "github.com/ConnorCairns/shipple/monkey/ws"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()

	mux := http.NewServeMux()

	log.Printf("Starting web server on %s", *addr)
	mux.HandleFunc("/ws", func(rw http.ResponseWriter, r *http.Request) {
		ws.ServeWs(rw, r)
	})

	handler := cors.Default().Handler(mux)

	err := http.ListenAndServe(*addr, handler)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
