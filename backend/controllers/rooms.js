const Message = require('../models/Message')
const Room = require('../models/Room')
const { v4: uuidv4 } = require('uuid')

const getRoom = async (user1, user2) => {
  try {
    const participants = [user1, user2].sort()
    const room = await Room.findOne({ participants })
    if (!room) {
      const newRoom = await Room.create({
        participants,
        roomId: uuidv4()
      })
      return newRoom
    }
    return room
  } catch(err) {
    throw(err)
  }
}

const getAllMessages = async (req, res, next) => {
  try {
    const { user1, user2 } = req.params
    const room = await getRoom(user1, user2)
    const messages = await Message.find({ room }).sort({ timestamp: 1 }).limit(50)
    res.status(200).json({ messages })
  } catch(err) {
    return next(err)
  }
}

module.exports = {
  getRoom,
  getAllMessages
}