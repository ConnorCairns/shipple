package ws

import "encoding/json"

type signalType int

const (
	undef signalType = iota

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
)

var toString = map[signalType]string{
	Subscribe:   "SUBSCRIBE",
	Unsubscribe: "UNSUBSRIBE",
	Message:     "MESSAGE",
	Status:      "STATUS",
}

var toID = map[string]signalType{
	"SUBSCRIBE":   Subscribe,
	"UNSUBSCRIBE": Unsubscribe,
	"MESSAGE":     Message,
	"STATUS":      Status,
}

// Signal represents an induvidial message of any type
type Signal struct {
	Cmd    signalType `json:"cmd"`
	Path   string     `json:"path"`
	Sender string     `json:"sender"`

	Message string `json:"message"`
}

func (s *signalType) UnmarshalJSON(data []byte) error {
	// Naughty pointer abuse
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

// FromBytes creates a signal from the raw WebSocket bytes
func FromBytes(payload []byte) Signal {
	var s Signal
	json.Unmarshal(payload, &s)

	return s
}
