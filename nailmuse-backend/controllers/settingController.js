const SalonSetting = require('../models/SalonSetting');

exports.getSettings = async (req, res) => {
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
};

exports.updateSettings = async (req, res) => {
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
};
