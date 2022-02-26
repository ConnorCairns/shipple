import { useContext, useEffect } from 'react'
import { useReducerContext } from '../ReducerProvider'
import SocketContext from './SocketContext'

const useChannel = (name, id) => {
    const socket = useContext(SocketContext)
    const [, dispatch] = useReducerContext()

    useEffect(() => {
        //const c = socket.channel(`game:${id}`, { name: name, client: 'browser', token: token })
        let res = socket.send(JSON.stringify({
            'cmd': "SUBSCRIBE",
            'path': name,
            'message': 'fosters',
        }))

        if (res.message !== 'Success') {
            return null //TODO: do something useful here 
        }
    }, [id, name, socket, dispatch]);

    return () => JSON.stringify({
        'cmd': "UNSUBSCRIBE",
        'path': name,
        'message': 'bye :(',
    })

}


export default useChannel