const CustomAPIError = require('./custom-api')
const { StatusCodes } = require('http-status-codes')

class BadRequstError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
    this.name = this.constructor.name
  }
}

module.exports = BadRequstError