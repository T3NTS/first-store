const jwt = require('jsonwebtoken')
const {UnAuthenticatedError} = require('../errors')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnAuthenticatedError('No bearer header!'))
  }
  try {
    const token = authHeader.split(" ")[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId)
    console.log(user)
    req.user = { userId: payload.userId, name: user.name, email: user.email }
    next()
  } catch(err) {
    console.log(err)
    return next(new UnAuthenticatedError('Authentication invalid!'))
  }
}

module.exports = authMiddleware
