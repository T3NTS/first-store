const express = require('express')
const router = express.Router()

const { getAllProducts, getProduct, createProduct, deleteProduct, updateProduct } = require('../controllers/products')

router.route('/').get(getAllProducts)

module.exports = router