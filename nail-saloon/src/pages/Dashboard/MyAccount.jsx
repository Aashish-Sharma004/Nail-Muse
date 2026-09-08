// src/pages/Dashboard/MyAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReviewModal from '../../components/common/ReviewModal';

const MyAccount = () => {
  const navigate = useNavigate();
  
  // Directly initialize user from localStorage to avoid cascading render warnings
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('user');

    if (!isLoggedIn || !storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // Fetch real bookings from backend for this user
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/user/${parsedUser.email}`);
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#2B1E16] font-serif text-xl">
        Loading your sanctuary dashboard...
      </div>
    );
  }

  // Get initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'NM';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const nextBooking = bookings.length > 0 ? bookings[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2B1E16] mb-2">
            Welcome back, {user?.name || 'Guest'}
          </h1>
          <p className="text-[#4A3B32] text-lg">
            Ready for your next self-care session?
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsReviewOpen(true)}
            className="px-4 py-3 bg-white border border-[#F0EBE1] text-[#2B1E16] text-sm font-medium rounded-lg hover:bg-[#FAF8F5] transition-all shadow-sm flex items-center gap-2"
          >
            <span>⭐</span> Rate Experience
          </button>
          <button 
            onClick={() => navigate('/services')}
            className="bg-[#2B1E16] text-[#FAF8F5] px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#4A3B32] transition-all shadow-md flex items-center gap-2"
          >
            <span>+</span> Book New
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Quick Links */}
        <div className="space-y-8">
          
          {/* Enhanced Profile Card */}
          <div className="bg-white border border-[#F0EBE1] shadow-sm rounded-2xl overflow-hidden text-center">
            {/* Cover Image */}
            <div className="h-32 bg-[#F5EFE6] relative">
              <img 
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80" 
                alt="Cover" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            
            {/* Avatar (Overlapping cover) */}
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-3xl font-serif text-[#2B1E16] -mt-12 mb-3 shadow-md border-4 border-white relative z-10">
              {getInitials(user?.name)}
            </div>
            
            <h2 className="text-2xl font-serif text-[#2B1E16]">{user?.name || 'Valued Member'}</h2>
            <p className="text-xs text-[#4A3B32] px-4 truncate">{user?.email}</p>
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#2B1E16] to-[#4A3B32] text-[#FAF8F5] text-xs font-semibold rounded-full mt-2 mb-6 tracking-wide shadow-sm">
              VIP MEMBER
            </span>
            
            {/* Loyalty Tracker */}
            <div 
              onClick={() => navigate('/rewards')}
              className="px-6 pb-2 text-left cursor-pointer group"
            >
              <div className="flex justify-between text-xs font-medium text-[#4A3B32] mb-1.5">
                <span className="group-hover:underline font-semibold">Gold Tier Rewards &rarr;</span>
                <span>450 / 500 Pts</span>
              </div>
              <div className="w-full bg-[#F5EFE6] rounded-full h-2">
                <div className="bg-[#2B1E16] h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <p className="text-[10px] text-[#4A3B32]/70 mt-2 text-center">Click to redeem points for free enhancements!</p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-3 gap-2 text-left border-t border-[#F0EBE1] pt-4 pb-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-serif text-[#2B1E16]">{bookings.length}</p>
                <p className="text-[10px] uppercase text-[#4A3B32] tracking-wider mt-1">Total Visits</p>
              </div>
              <div className="text-center border-l border-r border-[#F0EBE1]">
                <p className="text-lg font-serif text-[#2B1E16] leading-tight truncate px-1">Elena M.</p>
                <p className="text-[10px] uppercase text-[#4A3B32] tracking-wider mt-1">Fav Tech</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif text-[#2B1E16]">3</p>
                <p className="text-[10px] uppercase text-[#4A3B32] tracking-wider mt-1">Reviews</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white border border-[#F0EBE1] shadow-sm rounded-2xl p-4 flex flex-col space-y-1">
            <Link to="/services" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#4A3B32] hover:bg-[#FAF8F5] hover:text-[#2B1E16] rounded-lg transition-colors">
              View Services
            </Link>
            <Link to="/account" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#2B1E16] bg-[#FAF8F5] rounded-lg transition-colors">
              My Appointments
            </Link>
            <Link to="/rewards" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#4A3B32] hover:bg-[#FAF8F5] hover:text-[#2B1E16] rounded-lg transition-colors">
              Loyalty Rewards
            </Link>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Appointment */}
          <div>
            <h3 className="text-xl font-serif text-[#2B1E16] mb-4">Your Next Visit</h3>
            {nextBooking ? (
              <div 
                className="relative rounded-2xl overflow-hidden shadow-lg p-6 md:p-8 bg-[#2B1E16] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase rounded-full mb-3 backdrop-blur-md">
                    {nextBooking.status || 'Confirmed'}
                  </span>
                  <h4 className="text-2xl font-serif mb-1">{nextBooking.serviceTitle}</h4>
                  <p className="text-sm text-white/80 mb-4">with {nextBooking.technicianName}</p>
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm text-sm">
                    📅 {nextBooking.date} • {nextBooking.time}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/booking/tracker')}
                  className="px-6 py-3 bg-amber-400 text-[#2B1E16] text-sm font-bold rounded-lg hover:bg-amber-300 transition-all shadow-md w-full sm:w-auto"
                >
                  🕒 Track Live Status
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#F0EBE1] rounded-2xl p-8 text-center shadow-sm">
                <p className="text-[#4A3B32] mb-4">You have no upcoming appointments scheduled.</p>
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-[#2B1E16] text-[#FAF8F5] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#4A3B32] transition-all"
                >
                  Book Your First Service
                </button>
              </div>
            )}
          </div>

          {/* All Bookings List */}
          <div>
            <h3 className="text-xl font-serif text-[#2B1E16] mb-4">Appointment History</h3>
            <div className="bg-white border border-[#F0EBE1] shadow-sm rounded-2xl p-6">
              {bookings.length === 0 ? (
                <p className="text-sm text-[#4A3B32] text-center py-4">No past or current bookings found in your account.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((item) => (
                    <div key={item._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1] gap-3">
                      <div>
                        <h4 className="font-semibold text-base text-[#2B1E16]">{item.serviceTitle}</h4>
                        <p className="text-xs text-[#4A3B32]">Tech: {item.technicianName} | Date: {item.date} ({item.time})</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                          {item.status || 'Confirmed'}
                        </span>
                        <span className="font-serif font-bold">₹{item.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    </div>
  );
};

export default MyAccount;