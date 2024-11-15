const Product = require('../models/Product')

const getAllProducts = async (req, res, next) => {
  const { from, to, name, sort } = req.query
  const queryObject = {}
  try {
    if (from && to) {
      queryObject.price = {
        '$gte': Number(from),
        '$lte': Number(to)
      }
    }
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' }
    }
    let result = Product.find(queryObject)
    if (sort) {
      const sortList = sort.split(',').join(' ')
      result = result.sort(sortList)
    } else {
      result = result.sort('createdAt')
      console.log(result)
    }
    const products = await result
    console.log(products)
    res.status(200).json({products})
  } catch(err) {
    return next(err)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json({ product })
  } catch(err) {
    return next(err)
  }
}

const createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.userId
    //console.log({...req.body, createdBy: req.user.userId})
    const product = await Product.create(req.body)
    console.log(product)
    res.status(200).json({product})
  } catch(err) {
    next(err)
  }
}

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.status(200).json({ id: req.params.id })
}

const updateProduct = async (req, res, next) => {
  try {
    const { name, price, imageURL } = req.body
    const { id } = req.params
    if (!name || !price || !imageURL) {
      res.status(400).send('All fields must be filled!')
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
    if (!product) {
      res.status(404).send(`Product with id: ${id} is not found!`)
    }
    res.status(200).json({ product })
  } catch(err) {
    next(err)
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}