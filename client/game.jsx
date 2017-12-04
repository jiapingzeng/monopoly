import React from 'react'
import io from 'socket.io-client'

import Board from './board.jsx'
import Chat from './chat.jsx'
import Lobby from './lobby.jsx'

let socket

export default class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            textBox: '',
            hasUsername: false,
            isInGame: false,
            gameMap: [],
            messages: []
        }
    }

    addMessage(message, color) {
        var messages = this.state.messages
        this.setState({ messages: messages.concat([{ text: message, color: color ? color : 'black' }]) })
    }

    componentDidMount() {
        socket = io.connect({ reconnect: true })
        socket.on('user connected', (userId) => {
            console.log(`${userId} connected`)
        })
        socket.on('game started', (data) => {
            console.log('map received')
            this.setState({ gameMap: data.places })
            console.log(this.state.gameMap)
        })
        socket.on('message added', (data) => {
            this.addMessage(`${data.sender}: ${data.text}`, data.color)
        })
        socket.on('room joined', (data) => {
            console.log(data)
            this.setState({ isInGame: true })
            socket.emit('start game', { mapName: 'gunn' })
        })
        socket.on('user joined', (data) => {
            console.log(data)
        })
    }

    handleChange(event) {
        // TODO: form validation
        this.setState({ textBox: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.textBox) {
            console.log(this.state.textBox)
            if (this.state.hasUsername) {
                const message = this.state.textBox
                socket.emit('add message', { type: 'global', text: message })
                this.setState({ textBox: '' })
            } else {
                socket.emit('set username', this.state.textBox)
                // TODO: check if setting was successful
                this.setState({ textBox: '' })
                this.setState({ hasUsername: true })
            }
        }
    }

    render() {
        const gameMap = this.state.gameMap
        const messages = this.state.messages
        const hasUsername = this.state.hasUsername
        const isInGame = this.state.isInGame

        let board
        if (gameMap.length > 0) {
            board = (
                <Board gameMap={gameMap} />
            )
        } else {
            board = (
                <div>
                    <h1>Welcome!</h1>
                    <h3>Start by creating a username on the right side of the page -></h3>
                </div>
            )
        }
        let lobby
        if (hasUsername && !isInGame) {
            lobby = (
                <Lobby socket={socket} />
            )
        }
        const chatStyle = {
            width: `${400}px`,
            height: `${window.innerHeight * 0.8}px`,
            position: 'fixed',
            right: 0,
            outline: '3px solid black'
        }
        return (
            <div className='game'>
                <h1>MONOPOLY</h1>
                <div>
                    <div style={chatStyle}>
                        <h1>Lobby</h1>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label>{hasUsername ? 'Send message: ' : 'Set username: '}</label>
                            <input type='text' value={this.state.textBox} onChange={(e) => this.handleChange(e)} />
                            <input type='submit' value={this.state.hasUsername ? 'Send' : 'Submit'} />
                        </form>
                        <Chat messages={messages} />
                        <div>{lobby}</div>                        
                    </div>
                    <div>{board}</div>                    
                </div>
            </div>
        )
    }
}