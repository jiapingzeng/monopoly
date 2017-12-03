import React from 'react'
import io from 'socket.io-client'

import Board from './board.jsx'
import Chat from './chat.jsx'

let socket

export default class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            textBox: '',
            hasUsername: false,
            gameMap: [],
            messages: []
        }
    }

    addMessage(message) {
        var messages = this.state.messages
        this.setState({ messages: messages.concat([message]) })
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
            console.log(data.message)
            this.addMessage(`${data.sender}: ${data.message}`)
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
                socket.emit('add message', { type: 'global', message: message })
                this.setState({ textBox: '' })
            } else {
                socket.emit('set username', this.state.textBox)
                // TODO: check if setting was successful
                this.setState({ textBox: '' })
                this.setState({ hasUsername: true })
                socket.emit('start game')
            }
        }
    }

    render() {
        const gameMap = this.state.gameMap
        const messages = this.state.messages
        const hasUsername = this.state.hasUsername
        let board
        if (gameMap.length > 0) {
            board = (
                <Board gameMap={gameMap} />
            )
        } else {
            board = (
                <div>
                    <h1>Welcome!</h1>
                </div>
            )
        }
        return (
            <div className='game'>
                <h1>MONOPOLY</h1>
                <div>
                    <div>{board}</div>
                    <div>
                        <h1>Chat</h1>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label>{hasUsername ? 'Send message: ' : 'Set username: '}</label>
                            <input type='text' value={this.state.textBox} onChange={(e) => this.handleChange(e)} />
                            <input type='submit' value={this.state.hasUsername ? 'Send' : 'Submit'} />
                        </form>
                        <Chat messages={messages} />
                    </div>
                </div>
            </div>
        )
    }
}