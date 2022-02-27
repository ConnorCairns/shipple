import { useContext } from "react"
import { useReducerContext } from "../ReducerProvider"
import SocketContext from "./SocketContext"

const useSocket = ({ cmd, path, message }) => {
    const socket = useContext(SocketContext)
    const [state,] = useReducerContext()

    if (state.connected) {
        socket.send(JSON.stringify({
            'cmd': cmd,
            'path': path,
            'message': message,
        }))

        return 200
    }

    return 500
}

export default useSocket