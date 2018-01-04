import React from 'react'

export default class Stats extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var style = {
            width: `${350}px`,
            height: `${window.innerHeight * 0.8}px`,
            position: 'fixed',
            left: '0px',
            outline: 'black solid 3px'
        }
        var blockStyle = {
            outline: 'black solid 2px'
        }
        console.log('IT WORKS')
        console.log(this.props.players)
        this.props.players.map((p) => { console.log(p) })
        return (
            <div style={style}>
                <h2>player stats</h2>
                {this.props.players.map((player) => {
                return (
                    <div key={player.order} style={blockStyle}>
                        <h2>{player.name}</h2>
                        <h4>{player.wealth}</h4>
                    </div>
                )
            })}</div>
        )
    }
}