package ws

import (
	"encoding/json"
	"fmt"
)

type SignalType int

const (
	undef SignalType = iota

	// Subscribe tells the handler we want to subscribe to another channel
	Subscribe

	// Unsubscribe tells the handler to remove the client from that channel
	Unsubscribe

	// Message tells the handler to pass the payload onto the router for another
	// handler function to worry about.
	// Most messages like this - the handler will look up the "path" and call
	// a registered
	Message

	Status
	Disconnect
)

var toString = map[SignalType]string{
	Subscribe:   "SUBSCRIBE",
	Unsubscribe: "UNSUBSRIBE",
	Message:     "MESSAGE",
	Status:      "STATUS",
	Disconnect:  "DISCONNECT",
}

var toID = map[string]SignalType{
	"SUBSCRIBE":   Subscribe,
	"UNSUBSCRIBE": Unsubscribe,
	"MESSAGE":     Message,
	"STATUS":      Status,
	"DISCONNECT":  Disconnect,
}

// Signal represents an induvidial message of any type
type Signal struct {
	Cmd    SignalType `json:"cmd"`
	Path   string     `json:"path"`
	Sender string     `json:"sender"`

	Message string `json:"message"`
}

func (s *SignalType) UnmarshalJSON(data []byte) error {
	var t string

	err := json.Unmarshal(data, &t)
	if err != nil {
		return err
	}

	if v, ok := toID[t]; ok {
		*s = v
	}
	return nil
}

func (s SignalType) MarshallJSON() ([]byte, error) {
	if s, ok := toString[s]; ok {
		return json.Marshal(s)
	}

	return nil, fmt.Errorf("unknown message type")

}

// FromBytes creates a signal from the raw WebSocket bytes
func FromBytes(payload []byte) Signal {
	var s Signal
	json.Unmarshal(payload, &s)

	return s
}
