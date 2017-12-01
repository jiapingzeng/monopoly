import React from 'react'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        const gameMap = this.props.gameMap
        return (
            <div className='board'>
                <ul>
                    {gameMap.map((item, index) => (
                        <li key={index}>{item.name}</li>
                    ))}
                </ul>
            </div>
        )
    }
}