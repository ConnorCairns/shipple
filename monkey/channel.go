package main

import "sync"

// Channel allows clients to subscribe to different topics
type Channel struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

type channelMap struct {
	mu      sync.Mutex
	chanMap map[string]*Channel
}

var globalChannelMap channelMap

func chanInit() {
	globalChannelMap = channelMap{
		chanMap: make(map[string]*Channel),
	}
}

// Gets a `Channel` from react
func GetChannelFromPath(path string) (*Channel, bool) {
	ch, ok := globalChannelMap.chanMap[path]

	return ch, ok
}

func (cm *channelMap) addMapping(path string, channel *Channel) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.chanMap[path] = channel
}

func newChannel(path string) *Channel {
	ch := &Channel{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}

	globalChannelMap.addMapping(path, ch)

	return ch
}

func (s *Channel) run() {
	for {
		select {
		case client := <-s.register:
			s.clients[client] = true

		case client := <-s.unregister:
			if _, ok := s.clients[client]; ok {
				delete(s.clients, client)
				close(client.send)
			}

		case message := <-s.broadcast:
			for client := range s.clients {
				select {
				case client.send <- message:
				default: // If we can't send, presume the client has DC'd
					close(client.send)
					delete(s.clients, client)
				}
			}
		}
	}
}

func findChannel(channel string) {

}
