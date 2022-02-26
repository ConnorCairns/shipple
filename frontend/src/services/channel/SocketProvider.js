import React, { useEffect, useState } from 'react'
import { useReducerContext } from '../ReducerProvider'

import SocketContext from './SocketContext'

const SocketProvider = ({ wsUrl, children }) => {
    const [socket, setSocket] = useState()
    const [, dispatch] = useReducerContext()

    //setup socket
    useEffect(() => {
        const s = new WebSocket(wsUrl)
        setSocket(s)

        s.onmessage = (event) => {
            dispatch({ type: event.message.type, payload: event.message.payload })
        }

    }, [wsUrl, dispatch])

    if (!socket) return null;

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider