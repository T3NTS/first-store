const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  participants: {
    type: [String],
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: null
  }
})

module.exports = mongoose.model('Room', roomSchema)
