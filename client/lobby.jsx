import React from 'react'

let socket

export default class Lobby extends React.Component {
    constructor(props) {
        super(props)
        socket = props.socket
        this.state = {
            textBox: ''
        }
    }

    handleChange(event) {
        this.setState({ textBox: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.textBox) {
            console.log(`joining room ${this.state.textBox}`)
            socket.emit('join room', this.state.textBox)
        }
    }

    render() {
        return (
            <div className='lobby'>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <label>Enter game code: </label>
                    <input type='text' onChange={(e) => this.handleChange(e)} />
                    <input type='submit' value='Join game' />
                </form>
            </div>
        )
    }
}