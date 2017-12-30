import fs from 'fs'

const socketUsers = new Map()
//var socketUser = {
//    username: ''
//}
const socketRooms = new Map()
//var socketRoom = {
//    map: {},
//    turn: 0,
//    players: [{
//        name: '',
//        id: '',
//        order: 0,
//        ready: false,
//        position: 0,
//        wealth: 0,
//        properties: []
//    }]
//}
// TODO: remove name property and use socketUsers.get(players.id)

export default function attachSockets(io) {
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`)
        socket.emit('user connected', socket.id)

        socket.on('set username', (username) => {
            if (!socketUsers.has(socket.id)) {
                console.log(`${socket.id} is now ${username}`)
                socket.username = username
                socketUsers.set(socket.id, { username: username })
            }
        })

        socket.on('add message', (data) => {
            data.sender = socketUsers.get(socket.id).username
            if (!data.color) data.color = 'black'
            switch (data.type) {
                case 'room':
                    if (socket.room) {
                        socket.broadcast.to(socket.room).emit('message added', data.message)
                    }
                    break
                case 'global':
                    socket.broadcast.emit('message added', data)
                    break
            }
            data.color = 'green'
            socket.emit('message added', data)
        })

        socket.on('join room', (roomId) => {
            if (socket.room) socket.leave(room)
            socket.room = roomId
            socket.join(roomId)
            console.log(`attempting to join room ${roomId}`)
            var username = socketUsers.get(socket.id).username
            if (socketRooms.has(roomId)) {
                if (socketRooms.get(roomId).players.length < 4) {
                    var updatedRoom = socketRooms.get(roomId)
                    updatedRoom.players.push({ id: socket.id, name: username, ready: true })
                    socketRooms.set(roomId, updatedRoom)
                    socket.emit('room joined', updatedRoom)
                    socket.broadcast.to(roomId).emit('user joined', updatedRoom)
                    sendSystemMessage(`${username} has joined the room.`, roomId)
                }
            } else {
                var room = { players: [{ id: socket.id, name: username, ready: true }] }
                socketRooms.set(roomId, room)
                socket.emit('room joined', room)
                sendSystemMessage(`room ${roomId} has been created by ${username}.`)
            }
        })

        socket.on('start game', (data) => {
            var mapName = data && data.mapName ? data.mapName : 'world'
            fs.readFile(`./maps/${mapName}.json`, 'utf-8', (err, map) => {
                if (err) console.log(err)
                const roomId = socket.room
                if (readyToStart(roomId)) {
                    console.log(`starting game ${roomId}`)
                    var data = {}
                    data.map = JSON.parse(map)
                    data.players = socketRooms.get(roomId).players
                    emitToAll(roomId, 'game started', data.map)
                    initializeGame(roomId, data.map)
                    emitToAll(roomId, 'player moved', data)
                } else {
                    console.log('not ready to start')
                }
            })
            sendSystemMessage('Thanks for playing monopoly!')
            sendSystemMessage('This game is currently in testing and is probably full of bugs.')
        })

        socket.on('make move', (data) => {
            var room = socketRooms.get(socket.room)
            var players = room.players
            var index = -1
            // get player
            for (var i = 0; i < players.length; i++) {
                if (players[i].id == socket.id) {
                    index = i
                    break
                }
            }
            const player = players[index]
            if (room.turn == player.order) {
                // make move
                const moveBy = getRandomNumber(1, 6) + getRandomNumber(1, 6)
                movePlayer(room, index, moveBy)
                // update turn
                room.turn++
                if (room.turn >= players.length) {
                    room.turn -= players.length
                }
                socketRooms.set(socket.room, room)
                emitToAll(socket.room, 'player moved', room)
            }            
        })

        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`)
            if (socketUsers.get(socket.id)) {
                var room = socketRooms.get(socket.room)
                var players = room.players
                // remove player from room
                for (var i = 0; i < players.length; i++) {
                    if (players[i].id == socket.id) {
                        console.log(`${socket.username} has left room ${socket.room}`)
                        players.splice(i, 1)
                        break
                    }
                }
                // delete room if there is no one left
                if (players.length <= 0) {
                    console.log(`room ${socket.room} deleted`)
                    socketRooms.delete(socket.room)
                } else {
                    socketRooms.set(socket.room, room)
                }
            }
            // delete user
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

        var getRandomNumber = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min)
        }

        var readyToStart = (roomId) => {
            var players = socketRooms.get(roomId).players
            //if (players.length < 4) return false
            for (var i = 0; i < players.length; i++) {
                if (!players[i].ready) return false
            }
            return true
        }

        var initializeGame = (roomId, map) => {
            var room = socketRooms.get(roomId)
            room.map = map
            room.turn = 0
            for (var i = 0; i < room.players.length; i++) {
                var player = room.players[i]
                player.order = i
                player.position = 0
                player.wealth = 0
                player.properties = []
            }
        }

        var emitToAll = (roomId, event, data) => {
            socket.emit(event, data)
            socket.broadcast.to(roomId).emit(event, data)
        }

        var movePlayer = (room, playerIndex, moveBy) => {
            var players = room.players
            // update player position
            sendSystemMessage(`${players[playerIndex].name} moved ${moveBy} steps`, socket.room)
            var newPos = players[playerIndex].position + moveBy
            players[playerIndex].position = newPos >= 40 ? newPos - 40 : newPos
        }
    })
}