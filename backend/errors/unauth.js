const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./custom-api')

class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
    this.name = this.constructor.name
  }
}

module.exports = UnAuthenticatedError