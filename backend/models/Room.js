const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
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
  },
  lastMessage: {
    type: String,
    default: null
  }
})

module.exports = mongoose.model('Room', roomSchema)
