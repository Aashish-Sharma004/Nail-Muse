// routes/settingRoutes.js
const router = require('express').Router();
const SalonSetting = require('../models/SalonSetting');

// GET settings (auto-creates default record if none exists)
router.get('/', async (req, res) => {
  try {
    let settings = await SalonSetting.findOne();
    if (!settings) {
      settings = new SalonSetting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update salon settings & announcement banner
router.put('/', async (req, res) => {
  try {
    let settings = await SalonSetting.findOne();
    if (!settings) {
      settings = new SalonSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ message: 'Salon settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
