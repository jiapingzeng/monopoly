import React from 'react'

export default class Stats extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var style = {
            backgroundColor: 'red'
        }
        console.log('IT WORKS')
        console.log(this.props.players)
        this.props.players.map((p) => { console.log(p) })
        return (
            <div style={style}>{this.props.players.map((player) => {
                <div>
                    <h3>test</h3>
                </div>
            })}</div>
        )
    }
}