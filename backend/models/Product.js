const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxLength: 50
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0.01, 'Price must be at least 0.01'],
    max: [9999999, 'Price cannot exceed 9999999']
  },
  imageURL: {
    type: String,
    default: 'https://kansascounties.org/global_graphics/default-store-350x350.jpg',
    maxLength: 1000
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  }
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)