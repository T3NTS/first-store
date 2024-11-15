const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleWare = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }
  if (err.name === 'ValidationError') {
    customError.statusCode = 400
    customError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(',')
  }
  if (err.name === 'UnAuthenticatedError') {
    customError.statusCode = 401
    customError.msg = err.message
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleWare

