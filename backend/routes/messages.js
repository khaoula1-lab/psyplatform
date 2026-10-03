const express = require('express');
const {
    getConversations,
    getMessages,
    sendMessage
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', auth, getConversations);
router.get('/:userId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;
