const Cart = require('../models/Cart')
const { StatusCodes } = require('http-status-codes')

const getCart = async (req, res, next) => {
  try {
    const { userId, name, email } = req.user
    const cart = await Cart.findOne({ userId: userId })
    if (!cart) {
      const newCart = await Cart.create({
        userId,
        items: []
      })
      return res.status(StatusCodes.CREATED).json(newCart)
    } else {
      return res.status(StatusCodes.OK).json(cart)
    }
  } catch(err) {
    next(err)
  }
}

const addToCart = async (req, res, next) => {
  try {
    const { userId, name, email } = req.user
    const { productId, quantity } = req.body
    const cart = await Cart.findOne({ userId: userId })

    const productIndex = cart.items.findIndex(item => item.productId.equals(productId))
    if (productIndex === -1) {
      cart.items.push(req.body)
    } else {
      cart.items[productIndex].quantity += 1
    }
    await cart.save()
    return res.status(StatusCodes.OK).json(cart)
  } catch(err) {
    next(err)
  }
}

const updateCartQuantity = async (req, res, next) => {
  try {
    const { userId, name, email } = req.user
    const { productId, quantity } = req.body
    const newCart = await Cart.findByIdAndUpdate(userId, 
      { $set: { 'items.$[elem].quantity': quantity}},
      {
        arrayFilters: [{ 'elem.productId': productId }],
        new: true
      }
    )
    return res.status(StatusCodes.OK).json(newCart)
  } catch(err) {
    next(err)
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity
}