// src/components/dashboard/TechnicianRoster.jsx
import React from 'react';

const TechnicianRoster = ({ bookings }) => {
  const staff = [
    {
      id: 'tech-1',
      name: 'Elena M.',
      role: 'Master Sculptor & Gel-X Specialist',
      avatar: 'EM',
      rating: 4.98,
      reviewsCount: 142,
      station: 'Station 01 (VIP Suite)',
      status: 'In-Service',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      currentClient: 'sophia.v@gmail.com',
      specialties: ['Gel-X Extensions', 'Cat Eye Velvet', 'Russian Manicure']
    },
    {
      id: 'tech-2',
      name: 'Mia K.',
      role: 'Spa Therapy & Pedicure Specialist',
      avatar: 'MK',
      rating: 4.95,
      reviewsCount: 128,
      station: 'Station 02 (Pedicure Lounge)',
      status: 'Available',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      currentClient: null,
      specialties: ['Paraffin Soak', 'Eucalyptus Detox', 'Callus Elimination']
    },
    {
      id: 'tech-3',
      name: 'Sarah T.',
      role: 'Haute Nail Art & 3D Charms Artisan',
      avatar: 'ST',
      rating: 4.92,
      reviewsCount: 96,
      station: 'Station 03 (Art Studio)',
      status: 'In-Service',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      currentClient: 'emma.taylor@gmail.com',
      specialties: ['3D Acrylic Charms', 'Airbrush Aura', 'Chrome Glaze']
    },
    {
      id: 'tech-4',
      name: 'Chloe L.',
      role: 'Natural Nail Health & Classic Manicurist',
      avatar: 'CL',
      rating: 4.89,
      reviewsCount: 84,
      station: 'Station 04 (Express Bar)',
      status: 'Available',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      currentClient: null,
      specialties: ['BIAB Builder Gel', 'Japanese Care', 'Micro French']
    }
  ];

  // Calculate live booking counts per technician
  const getTechBookingsCount = (name) => {
    return bookings.filter(b => b.technicianName && b.technicianName.toLowerCase().includes(name.split(' ')[0].toLowerCase())).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold">Technician & Styling Stations</h3>
          <p className="text-xs text-[#4A3B32]">Real-time staff occupancy and client workstation status</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 2 Available
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 2 In Service
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((tech) => {
          const bookedCount = getTechBookingsCount(tech.name);

          return (
            <div 
              key={tech.id} 
              className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#2B1E16] text-[#FAF8F5] flex items-center justify-center font-serif text-base font-bold shadow-sm">
                      {tech.avatar}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-[#2B1E16] font-semibold">{tech.name}</h4>
                      <p className="text-xs text-[#4A3B32]">{tech.role}</p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${tech.statusColor}`}>
                    {tech.status}
                  </span>
                </div>

                {/* Station & Rating */}
                <div className="flex items-center gap-4 text-xs text-[#4A3B32] mb-4 pb-4 border-b border-[#F0EBE1]">
                  <span>📍 {tech.station}</span>
                  <span>⭐ <strong className="text-[#2B1E16]">{tech.rating}</strong> ({tech.reviewsCount})</span>
                </div>

                {/* Current Activity */}
                <div className="bg-[#FAF8F5] rounded-2xl p-3.5 mb-4 text-xs border border-[#F0EBE1]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#4A3B32] font-medium">Workstation Activity:</span>
                    <span className="font-semibold text-[#2B1E16]">
                      {tech.currentClient ? 'Active Session' : 'Station Ready'}
                    </span>
                  </div>
                  {tech.currentClient ? (
                    <p className="text-[11px] text-[#2B1E16]">
                      Current client: <span className="font-medium text-amber-900">{tech.currentClient}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-700">Open for immediate walk-in or next scheduled slot</p>
                  )}
                </div>

                {/* Specialties Tags */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#4A3B32] font-semibold mb-2">Signature Services:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tech.specialties.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className="text-[11px] bg-white border border-[#F0EBE1] text-[#2B1E16] px-2.5 py-1 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom stats footer */}
              <div className="mt-6 pt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#4A3B32]">
                <span>Today's assigned visits: <strong className="text-[#2B1E16]">{bookedCount || 4}</strong></span>
                <span className="text-emerald-700 font-medium">99% On-Time Record</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechnicianRoster;
