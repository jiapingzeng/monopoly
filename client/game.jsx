import React from 'react'
import io from 'socket.io-client'

import Board from './board.jsx'

let socket

export default class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            gameMap: []
        }
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
    }

    handleChange(event) {
        // TODO: form validation
        this.setState({ username: event.target.value })
    }

    handleSubmit(event) {
        console.log(this.state.username)
        socket.emit('set username', this.state.username)
        socket.emit('start game')
        event.preventDefault()
    }

    render() {
        const gameMap = this.state.gameMap
        let board
        if (gameMap.length > 0) {
            board = (
                <Board gameMap={gameMap} />
            )
        } else {
            board = (
                <div>
                    <h1>Start game</h1>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <label>
                            Username:
                            <input type='text' value={this.state.username} onChange={(e) => this.handleChange(e)} />
                        </label>
                        <input type='submit' />
                    </form>
                </div>
            )
        }
        return (
            <div className='game'>
                <h1>TEST</h1>
                <div>{board}</div>
            </div>
        )
    }
}