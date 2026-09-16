// routes/serviceRoutes.js
const router = require('express').Router();
const Service = require('../models/Service');

const INITIAL_SERVICES = [
  {
    title: 'Signature Manicure',
    category: 'Essentials',
    price: '$45+',
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
    description: 'A meticulous detailing of nails and cuticles, followed by a hydrating hand massage and finished with a flawless polish application.'
  },
  {
    title: 'Signature Spa Pedicure',
    category: 'Essentials',
    price: '$65+',
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&w=600&q=80',
    description: 'Relax with a soothing foot soak, complete callus treatment, exfoliating scrub, extended lower leg massage, and perfect polish.'
  },
  {
    title: 'Gel Polish Manicure',
    category: 'Essentials',
    price: '$55+',
    duration: '50 mins',
    image: 'https://images.unsplash.com/photo-1516975080661-46bd8a25c386?auto=format&fit=crop&w=600&q=80',
    description: 'Enjoy long-lasting, chip-resistant color for up to two weeks. Includes full cuticle care and precise gel application.'
  },
  {
    title: 'Gel-X Extensions',
    category: 'Enhancements',
    price: '$85+',
    duration: '90 mins',
    image: 'https://images.unsplash.com/photo-1595868846142-f254dc5947a5?auto=format&fit=crop&w=600&q=80',
    description: 'Flawless, lightweight extensions using Apres Gel-X. Causes zero damage to natural nails while providing perfect shape and length.'
  },
  {
    title: 'Acrylic Full Set',
    category: 'Enhancements',
    price: '$75+',
    duration: '90 mins',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    description: 'Classic acrylic enhancements sculpted to perfection. Includes your choice of shape, length, and a standard gel polish finish.'
  },
  {
    title: 'Dip Powder (SNS)',
    category: 'Enhancements',
    price: '$60+',
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1502821614763-71887e594dfc?auto=format&fit=crop&w=600&q=80',
    description: 'A durable, odor-free alternative to acrylics infused with vitamins to strengthen your natural nails.'
  },
  {
    title: 'Minimalist Nail Art',
    category: 'Nail Art',
    price: '$15+',
    duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80',
    description: 'Subtle and chic. Add French tips, negative space designs, dots, or delicate lines to any base service.'
  },
  {
    title: 'Custom 3D / Gem Art',
    category: 'Nail Art',
    price: '$35+',
    duration: '30 mins',
    image: 'https://images.unsplash.com/photo-1629237699923-281b3793f773?auto=format&fit=crop&w=600&q=80',
    description: 'Elevate your set with intricate 3D sculpting, Swarovski crystals, chrome powders, or hand-painted murals.'
  },
  {
    title: 'IBX Strengthening',
    category: 'Treatments',
    price: '$20',
    duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    description: 'A penetrating toughening agent that fuses together the nails top layers to improve nail plate integrity.'
  },
  {
    title: 'Paraffin Wax Wrap',
    category: 'Treatments',
    price: '$15',
    duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1512496015851-a1dcaf768b55?auto=format&fit=crop&w=600&q=80',
    description: 'Intense moisture therapy for hands or feet. Relieves joint stiffness while leaving skin silky smooth.'
  },
  {
    title: 'Express Polish Change',
    category: 'Essentials',
    price: '$25',
    duration: '20 mins',
    image: 'https://images.unsplash.com/photo-1502821946029-798154cb8007?auto=format&fit=crop&w=600&q=80',
    description: 'In a rush? Quick removal of old standard polish, light shaping, and a fresh coat of lacquer.'
  },
  {
    title: 'Men’s Executive Grooming',
    category: 'Essentials',
    price: '$40',
    duration: '35 mins',
    image: 'https://images.unsplash.com/photo-1512413914564-162629b3524b?auto=format&fit=crop&w=600&q=80',
    description: 'Detailed cuticle care, precise shaping, buffing to a natural shine, and a tension-relief hand massage.'
  }
];

// GET all services (auto-seeds if database is empty)
router.get('/', async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: 1 });
    if (services.length === 0) {
      services = await Service.insertMany(INITIAL_SERVICES);
    }
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new service
router.post('/', async (req, res) => {
  try {
    const { title, category, price, duration, image, description } = req.body;
    if (!title || !category || !price) {
      return res.status(400).json({ error: 'Title, category, and price are required' });
    }

    const newService = new Service({
      title,
      category,
      price,
      duration: duration || '45 mins',
      image: image || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
      description: description || '',
      isAvailable: true
    });

    await newService.save();
    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update existing service
router.put('/:id', async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove service
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
