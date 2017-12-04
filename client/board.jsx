import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Grid from 'material-ui/Grid'

export default class Board extends React.Component {
    constructor(props) {
        super(props)
        console.log(props.gameMap)
        this.state = {
            rotate: 360
        }
    }

    renderCorners(width) {
        const gameMap = this.props.gameMap
        var style = {
            width: `${width}px`,
            height: `${width}px`
        }
        return (
            <div>
                <div style={style} className='block corner corner-tl top left'>
                    <h3>{gameMap[20].name}</h3>
                </div>
                <div style={style} className='block corner corner-tr top right'>
                    <h3>{gameMap[30].name}</h3>
                </div>
                <div style={style} className='block corner corner-bl bottom left'>
                    <h3>{gameMap[10].name}</h3>
                </div>
                <div style={style} className='block corner corner-br bottom right'>
                    <h3>{gameMap[0].name}</h3>
                </div>
            </div>
        )
    }

    renderSide(side, length, data) {
        var style = {
            width: `${9 * length}px`,
            height: `${2 * length}px`,
            left: `${length * 2}px`
        }
        if (side == 'left' || side == 'right') {
            style.top = `${length * 2}px`
            style.transformOrigin = `${side} top`
        }
        var blocks = []
        for (var i = 0; i < 9; i++) {
            const item = data[8 - i]
            var blockStyle = {
                width: `${length}px`,
                height: `${2 * length}px`,
                left: `${length * i}px`
            }
            blocks.push(
                <div key={`${side}-${i}`} style={blockStyle} className={`block ${side} ${side}-${i}`}>
                    <h3 style={{ top: `${length / 10}px` }} className='block-text'>{item.name}</h3>
                    <h4 style={{ bottom: `${length / 10}px` }} className='block-text'>{`${item.price ? this.abbreviateNumber(item.price) : ''}`}</h4>
                </div>
            )
        }
        return (
            <div style={style} className={`block-container ${side} ${side}-container`}>
                {blocks}
            </div>
        )
    }

    abbreviateNumber(value) {
        var suffixes = ["", "k", "m", "b", "t"]
        var suffixNum = Math.floor(("" + value).length / 3)
        var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2))
        if (shortValue % 1 != 0) {
            var shortNum = shortValue.toFixed(1)
        }
        return shortValue + suffixes[suffixNum]
    }

    handleClick() {
        const rotate = this.state.rotate
        if (rotate > 0) {
            this.setState({ rotate: rotate - 90 })
        } else {
            this.setState({ rotate: 270 })
        }
    }

    render() {
        const gameMap = this.props.gameMap
        const a = window.innerHeight * 0.9 / 13
        const rotate = this.state.rotate
        const boardStyle = {
            width: 13 * a,
            height: 13 * a
        }
        const centerStyle = {
            width: `${9 * a}px`,
            height: `${9 * a}px`,
            left: `${2 * a}px`,
            top: `${2 * a}px`,
            lineHeight: `${9 * a}px`
        }
        return (
            <div style={boardStyle} className={`board rotate-${rotate}`}>
                <div style={centerStyle} className={`block center-block rotate-${360 - rotate}`}>
                    <button onClick={() => this.handleClick()}>Rotate</button>
                </div>
                {this.renderCorners(2 * a)}
                {this.renderSide('top', a, gameMap.slice(21, 30))}
                {this.renderSide('bottom', a, gameMap.slice(1, 10))}
                {this.renderSide('left', a, gameMap.slice(11, 20))}
                {this.renderSide('right', a, gameMap.slice(31, 40))}
            </div>
        )
    }
}