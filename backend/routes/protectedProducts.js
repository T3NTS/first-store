const express = require('express')
const router = express.Router()

const { getProduct, createProduct, deleteProduct, updateProduct, getProductsBatch } = require('../controllers/products')

router.route('/').post(createProduct)
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct)
router.route('/batch').post(getProductsBatch)

module.exports = router