// src/pages/Dashboard/MyAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserBookings, updateBookingStatus } from '../../services/api';
import ReviewModal from '../../components/common/ReviewModal';

const MyAccount = () => {
  const navigate = useNavigate();
  
  // Directly initialize user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('user');

    if (!isLoggedIn || !storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch real bookings from backend for this user
    const fetchUserData = async () => {
      try {
        const response = await getUserBookings(parsedUser.email);
        setBookings(response.data || []);
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await updateBookingStatus(bookingId, 'Cancelled');
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
      showToast('Appointment successfully cancelled.');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      // Optimistic update
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
      showToast('Appointment marked as cancelled.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#2B1E16] font-serif text-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2B1E16] border-t-transparent rounded-full animate-spin"></div>
          <p>Loading your personal salon sanctuary...</p>
        </div>
      </div>
    );
  }

  // Get initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'NM';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Find the primary active booking (Confirmed or In-Service)
  const activeBooking = bookings.find(b => b.status === 'Confirmed' || b.status === 'In-Service') || (bookings.length > 0 ? bookings[0] : null);

  // Filtered appointments history
  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Upcoming') return b.status === 'Confirmed' || b.status === 'In-Service';
    return b.status === filterStatus;
  });

  const loyaltyPoints = user?.loyaltyPoints ?? 450;
  const loyaltyTier = user?.tier || 'Gold VIP Member';
  const progressPct = Math.min(100, Math.round((loyaltyPoints / 500) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative animate-fade-in">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 text-xs font-medium animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#4A3B32] font-semibold mb-1 block">
            Personal Client Sanctuary
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2B1E16] mb-2">
            Welcome back, {user?.name || 'Guest'}
          </h1>
          <p className="text-[#4A3B32] text-sm md:text-base">
            Track your appointments in real time, view queue status, and redeem membership perks.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setIsReviewOpen(true)}
            className="px-4 py-2.5 bg-white border border-[#F0EBE1] text-[#2B1E16] text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>⭐</span> Rate Visit
          </button>
          <button 
            onClick={() => navigate('/services')}
            className="bg-[#2B1E16] text-[#FAF8F5] px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4A3B32] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Book Treatment
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-100 transition-all shadow-xs cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Quick Navigation */}
        <div className="space-y-6">
          
          {/* Enhanced Profile Card */}
          <div className="bg-white border border-[#F0EBE1] shadow-sm rounded-3xl overflow-hidden text-center">
            {/* Cover Image */}
            <div className="h-28 bg-[#F5EFE6] relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80" 
                alt="Cover" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto bg-[#2B1E16] text-[#FAF8F5] rounded-full flex items-center justify-center text-2xl font-serif -mt-10 mb-3 shadow-md border-4 border-white relative z-10">
              {getInitials(user?.name)}
            </div>
            
            <h2 className="text-xl font-serif font-bold text-[#2B1E16] px-4">{user?.name || 'Valued Member'}</h2>
            <p className="text-xs text-[#4A3B32] px-4 truncate">{user?.email}</p>
            
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#2B1E16] to-[#4A3B32] text-[#FAF8F5] text-[11px] font-bold rounded-full mt-2 mb-4 tracking-wider shadow-2xs">
              👑 {loyaltyTier}
            </span>
            
            {/* Loyalty Tracker */}
            <div 
              onClick={() => navigate('/rewards')}
              className="px-6 pb-2 text-left cursor-pointer group"
            >
              <div className="flex justify-between text-xs font-medium text-[#4A3B32] mb-1.5">
                <span className="group-hover:underline font-semibold text-[#2B1E16]">Rewards Club &rarr;</span>
                <span className="font-bold text-amber-800">{loyaltyPoints} / 500 Pts</span>
              </div>
              <div className="w-full bg-[#F5EFE6] rounded-full h-2 overflow-hidden">
                <div className="bg-[#2B1E16] h-2 rounded-full" style={{ width: `${progressPct}%` }}></div>
              </div>
              <p className="text-[10px] text-[#4A3B32]/70 mt-2 text-center">Click to redeem points for free polish & vouchers</p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-[#F0EBE1] py-4 mt-4 bg-[#FAF8F5]/40">
              <div>
                <p className="text-xl font-serif font-bold text-[#2B1E16]">{bookings.length}</p>
                <p className="text-[10px] uppercase text-[#4A3B32] tracking-wider mt-0.5">Visits</p>
              </div>
              <div className="border-l border-r border-[#F0EBE1]">
                <p className="text-sm font-serif font-bold text-[#2B1E16] leading-tight truncate px-1">Elena M.</p>
                <p className="text-[10px] uppercase text-[#4A3B32] tracking-wider mt-0.5">Stylist</p>
              </div>
              <div>
                <p className="text-xl font-serif font-bold text-[#2B1E16]">{loyaltyPoints}</p>
                <p className="text-[10px] uppercase text-[#4A3B32] tracking-wider mt-0.5">Points</p>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="bg-white border border-[#F0EBE1] shadow-sm rounded-3xl p-4 flex flex-col space-y-1">
            <Link to="/booking/tracker" className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-100 rounded-xl transition-colors">
              <span className="flex items-center gap-2"><span>🕒</span> Live Queue Tracker</span>
              <span>&rarr;</span>
            </Link>
            <Link to="/services" className="flex items-center justify-between px-4 py-3 text-xs font-medium text-[#4A3B32] hover:bg-[#FAF8F5] hover:text-[#2B1E16] rounded-xl transition-colors">
              <span className="flex items-center gap-2"><span>💅</span> Explore Services Catalog</span>
              <span>&rarr;</span>
            </Link>
            <Link to="/rewards" className="flex items-center justify-between px-4 py-3 text-xs font-medium text-[#4A3B32] hover:bg-[#FAF8F5] hover:text-[#2B1E16] rounded-xl transition-colors">
              <span className="flex items-center gap-2"><span>🎁</span> Loyalty Rewards & Perks</span>
              <span>&rarr;</span>
            </Link>
            <Link to="/contact" className="flex items-center justify-between px-4 py-3 text-xs font-medium text-[#4A3B32] hover:bg-[#FAF8F5] hover:text-[#2B1E16] rounded-xl transition-colors">
              <span className="flex items-center gap-2"><span>💬</span> Studio Support</span>
              <span>&rarr;</span>
            </Link>
          </div>

        </div>

        {/* Right Column: Active Booking & History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active / Next Appointment Card */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif text-[#2B1E16] font-semibold">Your Next Salon Visit</h3>
              {activeBooking && (
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  activeBooking.status === 'In-Service'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    : activeBooking.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeBooking.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-[#F0EBE1] text-[#2B1E16]'
                }`}>
                  {activeBooking.status || 'Confirmed'}
                </span>
              )}
            </div>

            {activeBooking ? (
              <div className="relative rounded-3xl overflow-hidden shadow-lg p-6 md:p-8 bg-[#2B1E16] text-[#FAF8F5] flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      Station 01 VIP Suite
                    </span>
                    <span className="text-xs text-white/70">• Stylist: {activeBooking.technicianName}</span>
                  </div>

                  <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                    {activeBooking.serviceTitle}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 mb-4">
                    <span className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                      📅 {activeBooking.date}
                    </span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                      ⏰ {activeBooking.time}
                    </span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs font-bold text-amber-300">
                      ${activeBooking.totalAmount}
                    </span>
                  </div>

                  {activeBooking.notes && (
                    <p className="text-xs text-white/75 italic">
                      Special requests: "{activeBooking.notes}"
                    </p>
                  )}
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/15">
                  <button 
                    onClick={() => navigate('/booking/tracker', { state: { booking: activeBooking } })}
                    className="px-5 py-2.5 bg-amber-400 text-[#2B1E16] text-xs font-bold rounded-xl hover:bg-amber-300 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>🕒</span> Track Live Queue
                  </button>

                  <button 
                    onClick={() => navigate('/booking/date-time')}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/25 transition-all cursor-pointer"
                  >
                    Reschedule
                  </button>

                  {activeBooking.status !== 'Cancelled' && activeBooking.status !== 'Completed' && (
                    <button 
                      onClick={() => handleCancelBooking(activeBooking._id)}
                      className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold rounded-xl border border-rose-400/30 transition-all cursor-pointer ml-auto"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#F0EBE1] rounded-3xl p-8 text-center shadow-sm space-y-3">
                <p className="font-serif text-lg text-[#2B1E16]">No active appointments scheduled</p>
                <p className="text-xs text-[#4A3B32]">Ready for a luxurious manicure or relaxing pedicure session?</p>
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-[#2B1E16] text-[#FAF8F5] px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4A3B32] transition-all shadow-sm cursor-pointer inline-block"
                >
                  Book Your First Service &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Appointment History & Filter */}
          <div className="bg-white border border-[#F0EBE1] shadow-sm rounded-3xl p-6 md:p-8 space-y-5">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-xl font-serif text-[#2B1E16] font-semibold">Visit History & Activity</h3>
                <p className="text-xs text-[#4A3B32]">Detailed log of past and pending treatments</p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#F0EBE1]">
                {['All', 'Upcoming', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      filterStatus === st 
                        ? 'bg-[#2B1E16] text-[#FAF8F5] font-semibold shadow-2xs' 
                        : 'text-[#4A3B32] hover:text-[#2B1E16]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 pt-2">
              {filteredBookings.length === 0 ? (
                <div className="py-12 text-center text-[#4A3B32] space-y-1">
                  <p className="font-serif text-base text-[#2B1E16]">No visits match this filter</p>
                  <p className="text-xs">Try selecting 'All' to review your complete session log.</p>
                </div>
              ) : (
                filteredBookings.map((item) => {
                  const isFinished = item.status === 'Completed' || item.status === 'Cancelled';
                  const isActive = item.status === 'Confirmed' || item.status === 'In-Service';

                  return (
                    <div 
                      key={item._id} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1] gap-3 hover:bg-white transition-all shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-semibold text-sm text-[#2B1E16]">{item.serviceTitle}</h4>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'In-Service'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-[#EAE4D8] text-[#2B1E16]'
                          }`}>
                            {item.status || 'Confirmed'}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A3B32] mt-0.5">
                          Artist: <span className="font-medium text-[#2B1E16]">{item.technicianName}</span> • Date: {item.date} at {item.time}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-serif font-bold text-sm text-[#2B1E16]">${item.totalAmount}</span>
                        
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <>
                              <button
                                onClick={() => navigate('/booking/tracker', { state: { booking: item } })}
                                className="px-3 py-1 bg-[#2B1E16] text-[#FAF8F5] text-xs rounded-lg font-medium hover:bg-[#4A3B32] transition-colors cursor-pointer"
                              >
                                Live 🕒
                              </button>
                              <button
                                onClick={() => handleCancelBooking(item._id)}
                                className="px-2.5 py-1 text-rose-600 hover:text-rose-800 text-xs font-semibold hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {isFinished && (
                            <button
                              onClick={() => navigate('/services')}
                              className="px-3 py-1 border border-[#2B1E16] text-[#2B1E16] hover:bg-[#2B1E16] hover:text-[#FAF8F5] text-xs font-semibold rounded-lg transition-all cursor-pointer"
                            >
                              Book Again
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
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