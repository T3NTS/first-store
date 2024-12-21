const Message = require('../models/Message')
const Room = require('../models/Room')
const { v4: uuidv4 } = require('uuid')

const saveMessage = async (data) => {
  try {
      const { roomId } = data
      const message = new Message(data)
      await message.save()
      await Room.findOneAndUpdate({roomId}, {
        lastMessageAt: new Date()
      })
    } catch(err) {
      throw(err)
    }
}

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
    console.log(req.params)
    console.log(user1, user2)
    const room = await getRoom(user1, user2)
    const { roomId } = room
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(50)
    res.status(200).json({ messages })
  } catch(err) {
    return next(err)
  }
}

const deleteMessage = async (req, res) => {
}

const updateMessage = async (req, res, next) => {
}

module.exports = {
  getAllMessages,
  saveMessage,
  getRoom
}