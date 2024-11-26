const express = require('express')
const router = express.Router()

const { getUser } = require('../controllers/auth')
const { updateCart, getCart } = require('../controllers/cart')

router.route('/').get(getUser)
router.route('/:userId/cart').get(getCart).patch(updateCart)
//router.route('/:userId/cart').patch(updateCartQuantity)

module.exports = router