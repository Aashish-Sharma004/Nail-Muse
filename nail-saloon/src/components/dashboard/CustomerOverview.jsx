// src/components/dashboard/CustomerOverview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerOverview = ({ user, userBookings, onOpenNewBooking }) => {
  const navigate = useNavigate();

  const nextBooking = userBookings && userBookings.length > 0 ? userBookings[0] : {
    serviceTitle: 'Signature Gel Manicure',
    technicianName: 'Elena M.',
    date: 'October 24, 2026',
    time: '02:30 PM',
    totalAmount: 68,
    status: 'Confirmed'
  };

  const loyaltyPoints = user?.loyaltyPoints || 450;
  const loyaltyTier = user?.tier || 'Gold VIP Member';

  const quickFavorites = [
    { title: 'Velvet French Gel', duration: '60 min', price: '$65', image: '💅' },
    { title: 'Eucalyptus Spa Pedicure', duration: '50 min', price: '$55', image: '🌸' },
    { title: '3D Chrome Nail Art', duration: '75 min', price: '$80', image: '✨' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome & Member Status Banner */}
      <div className="bg-gradient-to-r from-[#2B1E16] via-[#3D2C21] to-[#4A3B32] text-[#FAF8F5] rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
                👑 {loyaltyTier}
              </span>
              <span className="text-xs text-[#FAF8F5]/80">• {loyaltyPoints} Rewards Points</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-2">
              Welcome to Your Sanctuary, {user?.name || 'Valued Guest'}
            </h2>
            <p className="text-xs md:text-sm text-[#FAF8F5]/85 max-w-xl leading-relaxed">
              Your personalized salon retreat. Manage upcoming styling sessions, track technician queue in real-time, and redeem membership perks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/services')}
              className="bg-[#FAF8F5] text-[#2B1E16] px-6 py-3 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-md text-center cursor-pointer"
            >
              Book Next Visit ✨
            </button>
            <button
              onClick={() => navigate('/rewards')}
              className="bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/25 px-5 py-3 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer"
            >
              Redeem Points 🎁
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Visit Hero & Loyalty Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Next Upcoming Appointment Highlight */}
        <div className="lg:col-span-2 bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A3B32]">
              Upcoming Treatment
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Confirmed & Ready
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-[#2B1E16] font-bold">
                  {nextBooking.serviceTitle || 'Signature Gel Manicure'}
                </h3>
                <p className="text-xs text-[#4A3B32]">
                  Stylist: <span className="font-semibold text-[#2B1E16]">{nextBooking.technicianName || 'Elena M.'}</span> • Station 01 VIP Suite
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-[#2B1E16] pt-1">
                  <span>📅 {nextBooking.date || 'October 24, 2026'}</span>
                  <span>⏰ {nextBooking.time || '02:30 PM'}</span>
                  <span className="font-bold text-emerald-800">${nextBooking.totalAmount || 68}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => navigate('/booking/tracker')}
                  className="px-4 py-2.5 bg-[#2B1E16] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#4A3B32] transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🕒</span> Live Queue Tracker
                </button>
                <button
                  onClick={() => navigate('/booking/date-time')}
                  className="px-4 py-2.5 bg-white border border-[#F0EBE1] text-[#2B1E16] text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Reschedule
                </button>
              </div>
            </div>

            {/* Quick treatment preparation tip */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 flex items-center gap-3">
              <span className="text-base">💅</span>
              <p>
                <strong>Studio Tip:</strong> Arrive 5-10 minutes early to enjoy our complimentary matcha or organic botanical herbal tea before your session.
              </p>
            </div>
          </div>

          {/* Quick Rebook / Loved Services */}
          <div className="mt-8 pt-6 border-t border-[#F0EBE1]">
            <h4 className="text-sm font-serif text-[#2B1E16] font-semibold mb-3">Favorite Quick Re-bookings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickFavorites.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate('/services')}
                  className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-[#F0EBE1] hover:border-[#2B1E16] rounded-2xl transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="text-xl mb-1.5">{item.image}</div>
                  <h5 className="font-serif font-medium text-xs text-[#2B1E16] group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h5>
                  <div className="flex justify-between items-center text-[11px] text-[#4A3B32] mt-1">
                    <span>{item.duration}</span>
                    <span className="font-bold text-[#2B1E16]">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Rewards Progress & Studio Profile */}
        <div className="space-y-6">
          
          {/* Rewards Card */}
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif text-lg text-[#2B1E16] font-semibold">Rewards Club</h4>
              <span className="text-xs font-bold text-amber-800">{loyaltyPoints} / 500 Pts</span>
            </div>

            <div className="w-full bg-[#F5EFE6] rounded-full h-2.5 overflow-hidden mb-2">
              <div className="bg-[#2B1E16] h-full rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-[11px] text-[#4A3B32] mb-4">
              Just <strong>50 more points</strong> to unlock your complimentary $20 Spa Pedicure or Gel Art voucher!
            </p>

            <button
              onClick={() => navigate('/rewards')}
              className="w-full py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] text-[#2B1E16] text-xs font-semibold rounded-xl hover:bg-[#F0EBE1] transition-colors cursor-pointer"
            >
              Explore All Vouchers &rarr;
            </button>
          </div>

          {/* Client Nail Profile Preferences */}
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm space-y-3.5">
            <h4 className="font-serif text-base text-[#2B1E16] font-semibold">Your Studio Preferences</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#4A3B32]">Preferred Nail Shape:</span>
                <span className="font-medium text-[#2B1E16]">Medium Almond</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#4A3B32]">Favorite Technique:</span>
                <span className="font-medium text-[#2B1E16]">Gel-X / Russian Cuticle</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#4A3B32]">Primary Stylist:</span>
                <span className="font-medium text-[#2B1E16]">Elena M.</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#4A3B32]">Complimentary Drink:</span>
                <span className="font-medium text-[#2B1E16]">Iced Oat Matcha</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Booking History Table */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-serif text-[#2B1E16] font-semibold">Personal Visit History</h3>
            <p className="text-xs text-[#4A3B32]">All past sessions and completed treatments</p>
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="text-xs font-semibold text-[#2B1E16] hover:underline underline-offset-4 cursor-pointer"
          >
            View Full Log &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {userBookings && userBookings.length > 0 ? (
            userBookings.map((b, idx) => (
              <div 
                key={b._id || idx}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1] gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-serif font-medium text-sm text-[#2B1E16]">{b.serviceTitle}</h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      {b.status || 'Confirmed'}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A3B32] mt-0.5">
                    {b.date} at {b.time} • Stylist: {b.technicianName}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif font-bold text-sm text-[#2B1E16]">${b.totalAmount}</span>
                  <button
                    onClick={() => navigate('/services')}
                    className="text-xs border border-[#2B1E16] text-[#2B1E16] hover:bg-[#2B1E16] hover:text-[#FAF8F5] px-3.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
                  >
                    Book Again
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#4A3B32] text-xs">
              <p className="font-serif text-base text-[#2B1E16] mb-1">No past appointments recorded yet</p>
              <p>Your finished salon visits will appear here.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CustomerOverview;
