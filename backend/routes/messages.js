const express = require('express')
const router = express.Router()

const { getAllMessages, getAllChats } = require('../controllers/messages')

router.route('/:userId/:roomId').get(getAllMessages)
router.route('/:userId').get(getAllChats)

module.exports = router