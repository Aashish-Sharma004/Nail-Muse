const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const settingRoutes = require('./routes/settingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection with auto-retry
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nailmuse';
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected Successfully to Atlas');
  } catch (err) {
    console.error('❌ MongoDB Connection Error (retrying in 2s):', err.message);
    setTimeout(connectDB, 2000);
  }
};
connectDB();

// Register Routes Properly
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('NailMuse Studio Backend is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});