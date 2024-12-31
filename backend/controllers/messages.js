const Message = require('../models/Message')
const Room = require('../models/Room')

const saveMessage = async (data) => {
  try {
      const { roomId } = data
      const message = await Message.create(data)
      await Room.findOneAndUpdate({ roomId }, { lastMessageId: message._id })
      return message
    } catch(err) {
      throw(err)
    }
}

const getAllMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 })
    res.status(200).json({ messages })
  } catch(err) {
    return next(err)
  }
}
//Maybe later add limits to how many chats can be opened
const getAllChats = async (req, res, next) => {
  try {
    const { userId } = req.params
    const rooms = await Room.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    }).populate('productId').populate('buyerId').populate('sellerId').populate('lastMessageId')
    const sortedRooms = rooms.sort((a, b) => {
      const dateA = a.lastMessageId?.createdAt || new Date[0]
      const dateB = b.lastMessageId?.createdAt || new Date[0]
      return new Date(dateB) - new Date(dateA)
    })
    res.status(200).json(sortedRooms)
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
  getAllChats
}