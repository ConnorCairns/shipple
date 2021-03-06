package ws

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ConnorCairns/shipple/monkey/models"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 1 * time.Second
	pingPeriod     = (pongWait * 100) / 10
	maxMessageSize = 512
	buffer         = 256
)

// Helpful to define these here as they're used a lot
var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool { return true },
}

// Client manages a signle websocket connection between the server and a client.
// It passes all recieved messages to the channel.
type Client struct {
	channels map[*Channel]struct{} // store a set of our channels

	conn *websocket.Conn

	send chan []byte

	// Helper stuff
	name string

	db *gorm.DB
}

func (c *Client) handle(message []byte) {
	s := FromBytes(message)

	switch s.Cmd {
	case Message:
		c.sendToChannel(s.Path, []byte(s.Message))
	case Subscribe:
		c.subscribe(s.Path)
	case Unsubscribe:
		c.unsubscribe(s.Path)
	}
}

func (c *Client) subscribe(path string) {
	log.Printf("Trying subscribe")
	ch, ok := GetChannelFromPath(path)
	if !ok {
		ch = newChannel(path)
		go ch.run()
	}
	ch.register <- c
	msg := Signal{
		Cmd:    Status,
		Path:   "",
		Sender: "sys",

		Message: "success",
	}

	raw, err := json.Marshal(msg)

	if err != nil {
		log.Printf("Error connecting client")
	} else {
		c.send <- raw
	}

	coord_bytes := models.CalculateCrawl(path, c.db)
	init_msg := Signal{
		Cmd:     Coordinates,
		Path:    path,
		Sender:  "sys",
		Message: string(coord_bytes),
	}
	log.Printf("Trying to calc crawl")
	init_raw, err := json.Marshal(init_msg)

	if err != nil {
		log.Printf("Error marshalling calc'd vals")
	} else {
		log.Println("Sending msg")
		ch.broadcast <- init_raw
	}
}

func (c *Client) unsubscribe(path string) {
	ch, ok := GetChannelFromPath(path)
	if ok {
		ch.unregister <- c
	}
}

func (c *Client) sendToChannel(path string, data []byte) {
	ch, ok := GetChannelFromPath(path)
	if ok {
		ch.broadcast <- data
	}
}

// readPump pumps messages from the WebSocket connection to the channel
//
// A goroutine running readPump is started for each connection.
// The application ensures that there is at most one reader for each
// connection by ensuring all reads come from this goroutine.
func (c *Client) readPump() {
	defer func() {
		// TODO: Unsubscribe!
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)

				for ch := range c.channels {
					ch.unregister <- c
				}
			}
			break
		}
		c.handle(message)
		// TODO: Broadcast message
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				log.Println("Sending msg failed")
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func ServeWs(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{conn: conn, send: make(chan []byte, buffer), name: "temp name", db: db}

	log.Println("Client connected")
	// Start our readers and writers for our clients in seperate Goroutines
	go client.writePump()
	go client.readPump()

	msg := Signal{
		Cmd:    Message,
		Path:   "",
		Sender: "sys",

		Message: "connected",
	}

	raw, err := json.Marshal(msg)

	client.send <- raw

}
