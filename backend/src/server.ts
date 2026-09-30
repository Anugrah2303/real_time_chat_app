import 'dotenv/config'
import http from 'http'
import fs from 'fs'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Server } from 'socket.io'
import connectDB from './configs/database'
import indexRoutes from './routes/index.route'
import errorHandler from './helper/error'
import { initSocket } from './sockets'
import { UPLOAD_DIR } from './constants/chat'

const { PORT = 5000, MONGO_URI, JWT_SECRET, CLIENT_URL = 'http://localhost:5173' } = process.env

if (!MONGO_URI || !JWT_SECRET) {
  console.error('MONGO_URI and JWT_SECRET must be set in .env')
  process.exit(1)
}

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: CLIENT_URL } })

app.set('io', io)

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: CLIENT_URL }))
app.use(express.json({ limit: '100kb' }))
app.use('/uploads', express.static(UPLOAD_DIR))

app.use('/api', rateLimit({ windowMs: 60_000, limit: 120 }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60_000, limit: 30 }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api', indexRoutes)

app.use(errorHandler)

initSocket(io)

const start = async () => {
  await connectDB()
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start()
