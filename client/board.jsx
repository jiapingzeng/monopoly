import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Grid from 'material-ui/Grid'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        console.log(window.innerHeight / 10)
        const style = {
            height: window.innerHeight * 0.9,
            width: window.innerHeight * 0.9,
            border: '2px solid black'
        }
        const gameMap = this.props.gameMap
        return (
            <div style={style} className='board'>
                {gameMap.map((item, index) => (
                    <div key={index} className='card'>
                        <h1>{item.name}</h1>
                        <p>{item.price ? `$${item.price}` : ''}</p>
                    </div>
                ))}
            </div>
        )
    }
}