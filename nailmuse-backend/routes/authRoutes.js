const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyAuth } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyAuth, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;