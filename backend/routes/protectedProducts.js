const express = require('express')
const router = express.Router()

const { getProduct, createProduct, deleteProduct, updateProduct } = require('../controllers/products')

router.route('/').post(createProduct)
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct)

module.exports = router