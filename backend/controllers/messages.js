const Message = require('../models/Message')
const Room = require('../models/Room')

const saveMessage = async (data) => {
  try {
      const { roomId, createdAt, message } = data
      await Message.create(data)
      await Room.findOneAndUpdate({ roomId }, {
        lastMessageAt: createdAt,
        lastMessage: message
      })
    } catch(err) {
      throw(err)
    }
}

const getRoom = async (roomId) => {
  try {
    console.log(productId, {productId})
    const room = await Room.findOne({ buyer, productId })
    if (!room) {
      const newRoom = await Room.create({ buyer, productId })
      console.log(newRoom)
      return newRoom
    }
    console.log(room)
    console.log('WOOHOOO PASSED GETROOM')
    return room
  } catch(err) {
    throw(err)
  }
}

const getAllMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(50)
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
    }).sort({ lastMessageAt: -1 }).populate('productId').populate('buyerId').populate('sellerId')
    res.status(200).json(rooms)
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
  getRoom,
  getAllChats
}