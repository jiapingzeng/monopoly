import gameMap from '../map.json'

const socketUsers = new Map()

export default function attachSockets(io) {
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`)
        socket.emit('user connected', socket.id)

        socket.on('set username', (username) => {
            console.log(`${socket.id} is now ${username}`)
        })

        socket.on('start game', () => {
            socket.emit('game started', gameMap)
        })

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
        })
    })
}