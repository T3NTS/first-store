const express = require('express')
const router = express.Router()

const { login, register, getUserName } = require('../controllers/auth')

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/getname').get(getUserName)

module.exports = router