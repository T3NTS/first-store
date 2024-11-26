const Cart = require('../models/Cart')
const { NotFoundError } = require('../errors')
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

const updateCart = async (req, res, next) => {
  try {
    const { userId, name, email } = req.user
    const { productId, quantity, action } = req.body
    const cart = await Cart.findOne({ userId: userId })
    const productIndex = cart.items.findIndex(item => item.productId.equals(productId))
    switch (action) {
      case 'add':
        if (productIndex === -1) {
          cart.items.push(req.body)
        } else {
          cart.items[productIndex].quantity += quantity 
        }
        break
      case 'update':
        if (productIndex === -1) {
          return next(new NotFoundError('Product not in cart!'))
        }
        cart.items[productIndex].quantity = quantity
        break
      case 'delete':
        if (productIndex === -1) {
          return next(new NotFoundError('Product not in cart!'))
        }
        cart.items.splice(productIndex, 1)
        break
    }
    await cart.save()
    return res.status(StatusCodes.OK).json(cart)
  } catch(err) {
    next(err)
  }
}
/*
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
}*/

module.exports = {
  updateCart,
  getCart
}