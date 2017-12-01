import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        const gameMap = this.props.gameMap
        return (
            <div className='board'>
                {gameMap.map((item, index) => (
                    <Card key={index} className='card'>
                        <CardContent>
                            <h1>{item.name}</h1>
                            <p>{item.price ? `$${item.price}` : ''}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }
}