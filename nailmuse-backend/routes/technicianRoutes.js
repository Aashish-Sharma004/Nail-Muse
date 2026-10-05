const router = require('express').Router();
const technicianController = require('../controllers/technicianController');

router.get('/', technicianController.getTechnicians);
router.post('/', technicianController.addTechnician);
router.put('/:id', technicianController.updateTechnician);
router.patch('/:id/toggle-availability', technicianController.toggleAvailability);
router.delete('/:id', technicianController.deleteTechnician);

module.exports = router;
