const router = require('express').Router();
const offerController = require('../controllers/offerController');

router.post('/send', offerController.sendOffer);
router.get('/', offerController.getCampaigns);
router.delete('/:id', offerController.deleteCampaign);

module.exports = router;
