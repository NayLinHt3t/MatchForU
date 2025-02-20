const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const messageController = require('../controllers/message');

router.post('/send', authController.protected, messageController.sendMessage);
router.get(
  '/conversation/:userId',
  authController.protected,
  messageController.getConversation
);
module.exports = router;
