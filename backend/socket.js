const { saveMessage } = require('./controllers/messages')
const Room = require('./models/Room')
const socketio = require('socket.io')
const crypto = require('crypto')
const Message = require('./models/Message')

let io

const initializeSocket = (server) => {
  if (!io) {
    io = socketio(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
      pingInterval: 25000,
      pingTimeout: 5000
    })

    io.on('connect', (socket) => {
      console.log(`User connected: ${socket.id}`)
      console.log(`Total connected clients: ${io.sockets.sockets.size}`)
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
        console.log(`Total connected clients: ${io.sockets.sockets.size}`)
      });

      socket.on('fetch_roomid', async ({ buyerId, productId, sellerId }, callback) => {
        try {
          const unhashed = `${buyerId}_${sellerId}_${productId}`
          const roomId = crypto.createHash('sha256').update(unhashed).digest('hex')
          const room = await Room.findOne({ roomId }).populate('lastMessageId')
            if (!room) {
              await Room.create({ buyerId, productId, sellerId, roomId })
            }
          callback(roomId)
        } catch(err) {
          console.log(err)
        }
      })

      socket.on('join_room', async ({ roomId, userId }) => {
        try {
          const room = await Room.findOne({ roomId })
          await socket.join(room.roomId)
          console.log(`${socket.id} joined room: ${room.roomId}`);
          const unseenMessages = await Message.find({ roomId, createdBy: {$ne: userId}, seen: false });
          if (unseenMessages.length > 0) {
            await Message.updateMany(
              {
                roomId,
                createdBy: { $ne: userId },
                seen: false
              },
              { $set: { seen: true } }
            )
            console.log('unseen msg:', unseenMessages)
            socket.to(roomId).emit('messages_seen')
          }
        } catch (error) {
          console.error('Error in join_room:', error);
        }
      })

      socket.on('send_message', async (data) => {
        try {
          const message = await saveMessage(data)
          console.log('message sent:', data)
          socket.emit('receive_message', message)
          socket.to(message.roomId).emit('receive_message', message)
        } catch(err) {
          console.log(err)
        }
      })
      socket.on('message_seen_live', async (data) => {
        try {
          console.log('message seen live:', data)
          await Message.findByIdAndUpdate(data._id, data)
          socket.to(data.roomId).emit('messages_seen')
        } catch (err) {
          console.log(err)
        }
      })
    })
  }
}

const getIO = () => {
  if (!io) {
    throw new Error('Scoket not initialized')
  }
  return io
}

module.exports = {
  initializeSocket,
  getIO
}