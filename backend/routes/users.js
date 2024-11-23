const express = require('express')
const router = express.Router()

const { getUser } = require('../controllers/auth')
const { addToCart, getCart } = require('../controllers/cart')

router.route('/').get(getUser)
router.route('/:userId/cart').get(getCart).patch(addToCart)

module.exports = router