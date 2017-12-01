import gameMap from '../map.json'

const socketUsers = new Map()
//socketUser
//{
//    username: ''
//}

export default function attachSockets(io) {
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`)
        socket.emit('user connected', socket.id)

        socket.on('set username', (username) => {
            console.log(`${socket.id} is now ${username}`)
            socketUsers.set(socket.id, { username: username })
            console.log(socketUsers)
        })

        socket.on('add message', (data) => {
            data.sender = socketUsers.get(socket.id).username
            switch (data.type) {
                case 'room':
                    //socket.broadcast.to(roomId).emit('message added', data.message)
                    break;
                case 'global':
                    socket.broadcast.emit('message added', data)                    
                    break;
            }
            console.log(data)
            socket.emit('message added', data)
        })

        socket.on('start game', () => {
            socket.emit('game started', gameMap)
        })

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
            socketUsers.delete(socket.id)
        })
    })
}