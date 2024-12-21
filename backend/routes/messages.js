const express = require('express')
const router = express.Router()

const { getAllMessages } = require('../controllers/messages')

router.route('/:user1/chat/:user2').get(getAllMessages)

module.exports = router