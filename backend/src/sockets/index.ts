import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import Message from '../models/message.model'
import { JwtPayload } from '../interfaces/user'
import { UserStatus } from '../enums/user.enum'
import { MessageStatus } from '../enums/message.enum'
import { SOCKET_EVENTS } from '../constants/socketEvents'
import { addSocket, removeSocket, getOnlineUserIds } from '../utils/onlineUsers'
import { registerChatHandlers } from './chat.handler'

export const initSocket = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (typeof token !== 'string' || !token) return next(new Error('Unauthorized'))
      const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
      const user = await User.findById(id)
      if (!user || user.status === UserStatus.BLOCKED) return next(new Error('Unauthorized'))
      socket.data.userId = user.id
      socket.data.name = user.name
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  io.on('connection', async (socket) => {
    const me = socket.data.userId as string

    socket.join(me)
    registerChatHandlers(io, socket)

    socket.on('disconnect', async () => {
      if (removeSocket(me) > 0) return
      const lastSeen = new Date()
      try {
        await User.findByIdAndUpdate(me, { lastSeen })
      } catch (err) {
        console.error(err)
      }
      socket.broadcast.emit(SOCKET_EVENTS.PRESENCE, { userId: me, online: false, lastSeen })
    })

    if (addSocket(me) === 1) socket.broadcast.emit(SOCKET_EVENTS.PRESENCE, { userId: me, online: true })
    socket.emit(SOCKET_EVENTS.ONLINE_LIST, getOnlineUserIds())

    try {
      const senders = await Message.find({ receiverId: me, status: MessageStatus.SENT }).distinct('senderId')
      if (senders.length) {
        await Message.updateMany({ receiverId: me, status: MessageStatus.SENT }, { status: MessageStatus.DELIVERED })
        senders.forEach(s => io.to(String(s)).emit(SOCKET_EVENTS.MESSAGES_STATUS, { by: me, status: MessageStatus.DELIVERED }))
      }
    } catch (err) {
      console.error(err)
    }
  })
}
