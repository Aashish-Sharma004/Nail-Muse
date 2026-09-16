// src/components/dashboard/AdminOverview.jsx
import React from 'react';

const AdminOverview = ({ stats, bookings, onSelectTab, onOpenNewBooking }) => {
  // Compute fallback stats if not provided
  const totalRevenue = stats?.totalRevenue ?? bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalCount = stats?.totalBookings ?? bookings.length;
  const inServiceCount = stats?.statusCounts?.['In-Service'] ?? bookings.filter(b => b.status === 'In-Service').length;
  const confirmedCount = stats?.statusCounts?.Confirmed ?? bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = stats?.statusCounts?.Completed ?? bookings.filter(b => b.status === 'Completed').length;

  // Services distribution
  const serviceDistribution = [
    { name: 'Signature Gel Manicure', count: 18, color: 'bg-amber-600', share: '38%' },
    { name: 'Luxury Spa Pedicure', count: 14, color: 'bg-[#2B1E16]', share: '29%' },
    { name: 'Custom Nail Art Set', count: 9, color: 'bg-rose-500', share: '19%' },
    { name: 'Gel-X Extensions', count: 7, color: 'bg-emerald-600', share: '14%' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue Card */}
        <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#F5EFE6] rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs uppercase tracking-wider text-[#4A3B32] font-semibold mb-1">Total Salon Revenue</p>
          <h3 className="text-3xl font-serif text-[#2B1E16] font-bold">${totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-700 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            <span>↑ 18.4%</span>
            <span className="text-[#4A3B32]/70">vs last month</span>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#F5EFE6] rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs uppercase tracking-wider text-[#4A3B32] font-semibold mb-1">Total Bookings</p>
          <h3 className="text-3xl font-serif text-[#2B1E16] font-bold">{totalCount}</h3>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#4A3B32]">
            <span className="font-semibold text-[#2B1E16]">{confirmedCount}</span> Confirmed • <span className="font-semibold text-emerald-700">{completedCount}</span> Done
          </div>
        </div>

        {/* In-Service Now */}
        <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs uppercase tracking-wider text-[#4A3B32] font-semibold mb-1">Active In-Service</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-serif text-[#2B1E16] font-bold">{inServiceCount}</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <p className="text-xs text-[#4A3B32] mt-3">Currently on styling stations</p>
        </div>

        {/* Salon Capacity / Efficiency */}
        <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#F5EFE6] rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs uppercase tracking-wider text-[#4A3B32] font-semibold mb-1">Staff Occupancy</p>
          <h3 className="text-3xl font-serif text-[#2B1E16] font-bold">85%</h3>
          <div className="w-full bg-[#F5EFE6] rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-[#2B1E16] h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Operations Split: Today's Schedule & Service Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Today's Quick Schedule Agenda */}
        <div className="lg:col-span-2 bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-serif text-[#2B1E16] font-semibold">Today's Salon Schedule</h3>
              <p className="text-xs text-[#4A3B32] mt-0.5">Live roster and current station queue</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onSelectTab('appointments')}
                className="text-xs font-semibold text-[#2B1E16] hover:underline underline-offset-4 cursor-pointer"
              >
                View All Appointments &rarr;
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {bookings.slice(0, 5).map((booking, idx) => {
              const isServing = booking.status === 'In-Service';
              const isDone = booking.status === 'Completed';

              return (
                <div 
                  key={booking._id || idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                    isServing 
                      ? 'bg-amber-50/60 border-amber-200 shadow-sm' 
                      : isDone 
                      ? 'bg-[#FAF8F5]/60 border-[#F0EBE1] opacity-75' 
                      : 'bg-white border-[#F0EBE1] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2B1E16] text-[#FAF8F5] flex items-center justify-center font-serif text-sm font-semibold shrink-0">
                      {booking.technicianName ? booking.technicianName.split(' ')[0][0] : 'N'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-medium text-[#2B1E16] text-base">{booking.serviceTitle}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          isServing 
                            ? 'bg-amber-200 text-amber-900 animate-pulse'
                            : isDone 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#F0EBE1] text-[#2B1E16]'
                        }`}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A3B32] mt-0.5">
                        Client: <span className="font-medium text-[#2B1E16]">{booking.userEmail}</span> • Artist: <span className="font-medium text-[#2B1E16]">{booking.technicianName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE1]">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-[#2B1E16]">{booking.time || '11:00 AM'}</p>
                      <p className="text-[11px] text-[#4A3B32]">{booking.date || 'Today'}</p>
                    </div>
                    <div className="font-serif font-bold text-[#2B1E16] text-base">
                      ${booking.totalAmount || 65}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#4A3B32]">Displaying top priority salon visits</span>
            <button
              onClick={onOpenNewBooking}
              className="text-xs bg-[#2B1E16] text-[#FAF8F5] px-4 py-2 rounded-xl font-medium hover:bg-[#4A3B32] transition-colors cursor-pointer"
            >
              + Add Walk-In Appointment
            </button>
          </div>
        </div>

        {/* Right 1 Col: Popular Services & Salon Highlights */}
        <div className="space-y-6">
          
          {/* Popular Services Breakdown */}
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-serif text-[#2B1E16] font-semibold mb-1">Top Services</h3>
            <p className="text-xs text-[#4A3B32] mb-5">Most booked treatments this week</p>

            <div className="space-y-4">
              {serviceDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-[#2B1E16]">
                    <span>{item.name}</span>
                    <span className="text-[#4A3B32]">{item.count} bookings ({item.share})</span>
                  </div>
                  <div className="w-full bg-[#F5EFE6] rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${item.color} h-full rounded-full`} 
                      style={{ width: item.share }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#4A3B32]">
              <span>Average service ticket</span>
              <span className="font-serif font-bold text-[#2B1E16] text-sm">$68.50</span>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-gradient-to-br from-[#2B1E16] to-[#4A3B32] text-[#FAF8F5] rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full inline-block mb-3">
                Manager Notice
              </span>
              <h4 className="font-serif text-lg text-white mb-2">Weekend Prime Hours Full</h4>
              <p className="text-xs text-[#FAF8F5]/85 leading-relaxed mb-4">
                Saturday and Sunday slots are currently 94% booked. Consider enabling 15-minute express slots for nail art touch-ups.
              </p>
              <button 
                onClick={() => onSelectTab('technicians')}
                className="text-xs bg-[#FAF8F5] text-[#2B1E16] font-semibold px-3.5 py-2 rounded-lg hover:bg-white transition-all shadow-sm cursor-pointer"
              >
                Review Staff Availability &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminOverview;
