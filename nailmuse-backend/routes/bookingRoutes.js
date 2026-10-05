const router = require('express').Router();
const bookingController = require('../controllers/bookingController');

router.post('/create', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/stats', bookingController.getStats);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);
router.get('/user/:email', bookingController.getUserBookings);

module.exports = router;