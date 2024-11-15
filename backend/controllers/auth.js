const User = require('../models/User')
const { BadRequstError, UnAuthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new BadRequstError('Please provide all credentials!'))
  }
  const user = await User.findOne({email})
  if (!user) {
    return next(new UnAuthenticatedError(`User with email ${email} not found!`))
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return next(new UnAuthenticatedError('Wrong password!'))
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).send({ user: {
    name: user.name,
    email: email
  }, token })
}

const register = async (req, res, next) => {
  /*
  const { email, name, password } = req.body
  if (!email || ! password || !name) {
    throw new BadRequstError('Please provide all credentials!')
  }*/
 try {
  console.log(req.body)
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token })
 } catch(err) {
  next(err)
 }
}

const getUser = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json(req.user)
  } catch(err) {
    next(err)
  }
}
//i thinnk i output productid here but should be userid chagende in singleproductpage.jsx
const getUserName = async (req, res, next) => {
  try {
    const user = await User.findById(req.headers.ownerid)
    console.log(user)
    res.status(StatusCodes.OK).json({name: user.name})
  } catch(err) {
    next(err)
  }
}

module.exports = {
  login,
  register,
  getUser,
  getUserName
}