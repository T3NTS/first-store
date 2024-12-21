const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true
  },
  message: { 
    type: String, 
    maxLength: 200, 
    required: true 
  },
  roomId: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

module.exports = mongoose.model('Message', messageSchema)
