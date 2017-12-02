import React from 'react'

export default function Chat(props) {
    return (
        <div className='chat'>
            <ul>
                {props.messages.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}