const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.patch('/:id/loyalty', userController.updateUserLoyalty);

module.exports = router;
