package main

import (
	s "github.com/ConnorCairns/shipple/monkey/signal"
)

var route = map[string]func(sig *s.Signal) error{
	"":     func(sig *s.Signal) error { return nil },
	"room": func(sig *s.Signal) error { return nil },
}
