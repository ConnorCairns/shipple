import { useContext, useEffect } from 'react'
import { useReducerContext } from '../ReducerProvider'
import SocketContext from './SocketContext'

const useChannel = (name, id) => {
    const socket = useContext(SocketContext)
    const [state, dispatch] = useReducerContext()

    useEffect(() => {
        if (state.connected) {
            socket.send(JSON.stringify({
                'cmd': "SUBSCRIBE",
                'path': name,
                'message': 'fosters',
            }))
        }
    }, [id, name, socket, dispatch, state.connected]);

    return () => JSON.stringify({
        'cmd': "UNSUBSCRIBE",
        'path': name,
        'message': 'bye :(',
    })

}


export default useChannel