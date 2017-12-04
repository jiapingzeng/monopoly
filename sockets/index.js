import fs from 'fs'

const socketUsers = new Map()
//socketUser
//{
//    username: ''
//}
const socketRooms = new Map()
//socketRoom
//{
//    users: []
//}

export default function attachSockets(io) {
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`)
        socket.emit('user connected', socket.id)

        socket.on('set username', (username) => {
            if (!socketUsers.has(socket.id)) {
                console.log(`${socket.id} is now ${username}`)
                socketUsers.set(socket.id, { username: username })
            }
        })

        socket.on('add message', (data) => {
            data.sender = socketUsers.get(socket.id).username
            if (data.color) {
                data.color = 'black'
            }
            switch (data.type) {
                case 'room':
                    //socket.broadcast.to(roomId).emit('message added', data.message)
                    break;
                case 'global':
                    socket.broadcast.emit('message added', data)
                    break;
            }
            console.log(data)
            data.color = 'green'
            socket.emit('message added', data)
        })

        socket.on('join room', (roomId) => {
            if (socket.room) {
                socket.leave(room)
            }
            socket.room = roomId
            socket.join(roomId)
            console.log(`attempting to join room ${roomId}`)
            var username = socketUsers.get(socket.id).username
            if (socketRooms.has(roomId)) {
                if (socketRooms.get(roomId).users.length < 4) {
                    var updatedRoom = socketRooms.get(roomId)
                    updatedRoom.users.push(username)
                    socketRooms.set(roomId, updatedRoom)
                    socket.emit('room joined', updatedRoom)
                    socket.broadcast.to(roomId).emit('user joined', updatedRoom)
                    sendSystemMessage(`${socket.id} has joined the room.`)
                }
            } else {
                var room = { users: [username] }
                socketRooms.set(roomId, room)
                socket.emit('room joined', room)
                sendSystemMessage(`room ${roomId} has been created by ${username}.`)
            }
            console.log(socketRooms.get(roomId))
        })

        socket.on('start game', (data) => {
            var mapName = data && data.mapName ? data.mapName : 'world'
            fs.readFile(`./maps/${mapName}.json`, 'utf-8', (err, data) => {
                if (err) {
                    console.log(err)
                }
                socket.emit('game started', JSON.parse(data))
            })
            sendSystemMessage('Thanks for playing monopoly!')
            sendSystemMessage('This game is currently in testing and is probably full of bugs.')
            sendSystemMessage('Here are some known issues: ')
            sendSystemMessage('1. Everything looks ugly as fuck')
            sendSystemMessage('2. The game doesn\'t work at all')
        })

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
            socketUsers.delete(socket.id)
        })

        var sendSystemMessage = (text, room) => {
            if (room == 'global') {
                socket.broadcast.emit('message added', { sender: 'System', color: 'red', text: text })
                socket.emit('message added', { sender: 'System', color: 'red', text: text })
            } else if (room) {
                socket.broadcast.to(room).emit('message added', { sender: 'System', color: 'red', text: text })
                socket.emit('message added', { sender: 'System', color: 'red', text: text })
            } else {
                socket.emit('message added', { sender: 'System', color: 'red', text: text })
            }
        }
    })
}