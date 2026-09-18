// routes/technicianRoutes.js
const router = require('express').Router();
const Technician = require('../models/Technician');

// Initial luxury technician roster to seed if DB is empty
const INITIAL_TECHNICIANS = [
  { 
    name: 'Elena M.', 
    category: 'Nail Art', 
    role: 'Master Nail Artist', 
    rating: 4.9, 
    exp: '5 Years', 
    reviews: 124, 
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
    badge: '♥ Customer Favorite',
    skills: ['3D Art', 'Hand-painted', 'Gems'],
    available: true
  },
  { 
    name: 'Mia K.', 
    category: 'Extensions', 
    role: 'Extension Specialist', 
    rating: 5.0, 
    exp: '7 Years', 
    reviews: 189, 
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    badge: '👑 Master Tech',
    skills: ['Gel-X', 'Acrylics', 'Sculpting'],
    available: true
  },
  { 
    name: 'David L.', 
    category: 'Essentials', 
    role: 'Classic Manicure Expert', 
    rating: 4.7, 
    exp: '6 Years', 
    reviews: 76, 
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    badge: '',
    skills: ['Natural Nails', 'Cuticle Care', "Men's Grooming"],
    available: true
  },
  { 
    name: 'Sarah T.', 
    category: 'Pedicure', 
    role: 'Spa & Pedicure Expert', 
    rating: 4.8, 
    exp: '4 Years', 
    reviews: 92, 
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    badge: '✨ Fills up fast',
    skills: ['Reflexology', 'Callus Treatment', 'Relaxation'],
    available: true
  },
  { 
    name: 'Jin S.', 
    category: 'Nail Art', 
    role: 'Trend Specialist', 
    rating: 4.9, 
    exp: '3 Years', 
    reviews: 54, 
    img: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=600&q=80',
    badge: '🔥 Trending',
    skills: ['Chrome', 'Aura Nails', 'Korean Style'],
    available: true
  }
];

// GET: Retrieve all technicians (auto-seeds if empty)
router.get('/', async (req, res) => {
  try {
    let technicians = await Technician.find().sort({ createdAt: -1 });
    
    // Auto-seed if database collection is empty
    if (technicians.length === 0) {
      await Technician.insertMany(INITIAL_TECHNICIANS);
      technicians = await Technician.find().sort({ createdAt: -1 });
    }
    
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new technician
router.post('/', async (req, res) => {
  try {
    const { name, role, category, rating, reviews, exp, img, badge, skills, available } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: 'Technician name and role are required.' });
    }

    // Process skills if sent as comma-separated string or array
    let processedSkills = skills;
    if (typeof skills === 'string') {
      processedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const newTechnician = new Technician({
      name,
      role,
      category: category || 'Nail Art',
      rating: Number(rating) || 5.0,
      reviews: Number(reviews) || 0,
      exp: exp || '3+ Years',
      img: img || 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
      badge: badge || '',
      skills: processedSkills || ['Custom Nail Art'],
      available: available !== undefined ? Boolean(available) : true
    });

    const savedTechnician = await newTechnician.save();
    res.status(201).json(savedTechnician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update an existing technician
router.put('/:id', async (req, res) => {
  try {
    const { name, role, category, rating, reviews, exp, img, badge, skills, available } = req.body;

    let processedSkills = skills;
    if (typeof skills === 'string') {
      processedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updatedData = {
      ...(name && { name }),
      ...(role && { role }),
      ...(category && { category }),
      ...(rating !== undefined && { rating: Number(rating) }),
      ...(reviews !== undefined && { reviews: Number(reviews) }),
      ...(exp && { exp }),
      ...(img && { img }),
      badge: badge !== undefined ? badge : '',
      ...(processedSkills && { skills: processedSkills }),
      ...(available !== undefined && { available: Boolean(available) })
    };

    const updatedTechnician = await Technician.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedTechnician) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    res.json(updatedTechnician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Quick toggle availability (on-duty / off-duty)
router.patch('/:id/toggle-availability', async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    technician.available = !technician.available;
    await technician.save();

    res.json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a technician
router.delete('/:id', async (req, res) => {
  try {
    const deletedTechnician = await Technician.findByIdAndDelete(req.params.id);
    if (!deletedTechnician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    res.json({ message: 'Technician removed successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
