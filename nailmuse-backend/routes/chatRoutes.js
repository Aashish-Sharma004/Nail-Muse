const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyAuth } = require('../middleware/auth');

router.post('/message', chatController.sendMessage);
router.get('/session/:sessionId', chatController.getSessionMessages);
router.get('/admin/conversations', verifyAuth, chatController.getAdminConversations);
router.get('/admin/session/:sessionId', verifyAuth, chatController.getAdminSessionThread);
router.post('/admin/reply', verifyAuth, chatController.adminReply);
router.patch('/admin/resolve/:sessionId', verifyAuth, chatController.markResolved);
router.delete('/admin/session/:sessionId', verifyAuth, chatController.deleteConversation);

module.exports = router;
