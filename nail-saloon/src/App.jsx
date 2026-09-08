// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext'; // Import Provider
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MyAccount from './pages/Dashboard/MyAccount';
import ServiceList from './pages/Services/ServiceList';
import LoyaltyRewards from './pages/Dashboard/LoyaltyRewards';
import SupportDrawer from './components/common/SupportDrawer';

// Import all booking files from your screenshot
import SelectTechnician from './pages/Booking/SelectTechnician';
import SelectDateTime from './pages/Booking/SelectDateTime';
import ReviewConfirm from './pages/Booking/ReviewConfirm';
import Checkout from './pages/Booking/Checkout';
import Confirmation from './pages/Booking/Confirmation';
import LiveTracker from './pages/Dashboard/LiveTracker';
import Appointments from './pages/Dashboard/Appointments';
import ScrollToTop from './components/common/ScrollToTop';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';


function App() {
  return (
    <Router>
      <ScrollToTop /> {/* 👈 Yahan Router ke andar sabse upar hona chahiye */}
      <BookingProvider> 
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/booking/tracker" element={<LiveTracker />} />
            <Route path="/rewards" element={<LoyaltyRewards />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* The multi-step booking routes */}
            <Route path="/booking/technician" element={<SelectTechnician />} />
            <Route path="/booking/date-time" element={<SelectDateTime />} />
            <Route path="/booking/review" element={<ReviewConfirm />} />
            <Route path="/booking/checkout" element={<Checkout />} />
            <Route path="/booking/confirmation" element={<Confirmation />} />
          </Routes>
        </Layout>
      </BookingProvider>
      <SupportDrawer />
    </Router>
  );
}

export default App;