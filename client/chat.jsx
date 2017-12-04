import React from 'react'

export default class Chat extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const style = {
            height: `${window.innerHeight * 0.6}px`
        }
        return (
            <div className='chat'>
                <ul style={style} className='chat-list'>
                    {this.props.messages.map((item, index) => (
                        <li style={{ color: item.color }} key={index}>{item.text}</li>
                    ))}
                </ul>
            </div>
        )
    }
}