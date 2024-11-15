const express = require('express')
const router = express.Router()

const { getUser } = require('../controllers/auth')

router.route('/').get(getUser)

module.exports = router