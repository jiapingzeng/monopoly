import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import favicon from 'serve-favicon'
import logger from 'morgan'
import path from 'path'
import SocketServer from 'socket.io'
import { Server } from 'http'

import attachSockets from './sockets'

export const app = express()
const appPort = process.env.PORT || 3000

app.set('view engine', 'ejs')

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(logger('dev'))

export const server = Server(app)
const io = new SocketServer(server)

attachSockets(io)

app.use(function (req, res, next) {
    res.io = io
    next()
})

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(appPort)
export default app