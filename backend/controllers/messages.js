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
    const { flag } = req.query
    console.log('fetching messages')
    console.log(flag)
    const query = { roomId }
    if (flag) {
      query._id = { $lt: flag._id }
    }
    const messages = await Message.find(query).sort({ createdAt: -1 }).limit(20)
    const sortedMessages = messages.reverse()
    res.status(200).json({ messages: sortedMessages })
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
      const dateA = a.lastMessageId?.createdAt || new Date()
      const dateB = b.lastMessageId?.createdAt || new Date()
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