package ws

var route = map[string]func(sig *Signal) error{
	"":     func(sig *Signal) error { return nil },
	"room": func(sig *Signal) error { return nil },
}
