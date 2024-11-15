const CustomAPIError = require('./custom-api')
const BadRequstError = require('./bad-request')
const NotFoundError = require('./not-found')
const UnAuthenticatedError = require('./unauth')

module.exports = {
  CustomAPIError,
  BadRequstError,
  NotFoundError,
  UnAuthenticatedError
}