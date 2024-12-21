const { saveMessage, getRoom } = require('./controllers/messages')
const socketio = require('socket.io')

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
      console.log(`User connected: ${socket.id}`);
      console.log(`Total connected clients: ${io.sockets.sockets.size}`);
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        console.log(`Total connected clients: ${io.sockets.sockets.size}`);
      });
      socket.on('join_room', async ({ user1, user2 }) => {
        try {
          const room = await getRoom(user1, user2)
          socket.join(room.roomId)
          console.log(`${socket.id} joined room: ${room.roomId}`);
          socket.emit('joined_room', { roomId: room.roomId });
        } catch (error) {
          console.error('Error in join_chat:', error);
        }
      })
      socket.on('send_message', async (data) => {
        try {
          await saveMessage(data)
          socket.to(data.roomId).emit('receive_message', data)
        } catch(err) {
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