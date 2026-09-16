// src/components/dashboard/AppointmentsTable.jsx
import React, { useState, useMemo } from 'react';

const AppointmentsTable = ({ bookings, onStatusChange, onDeleteBooking, onOpenNewBooking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTechnician, setSelectedTechnician] = useState('All');

  const statusOptions = ['All', 'Confirmed', 'In-Service', 'Completed', 'Cancelled'];
  
  // Extract unique technician names
  const technicians = useMemo(() => {
    const names = new Set();
    bookings.forEach(b => {
      if (b.technicianName) names.add(b.technicianName);
    });
    return ['All', ...Array.from(names)];
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        !searchTerm ||
        (b.userEmail && b.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.serviceTitle && b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.technicianName && b.technicianName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = selectedStatus === 'All' || (b.status || 'Confirmed') === selectedStatus;
      const matchesTech = selectedTechnician === 'All' || b.technicianName === selectedTechnician;

      return matchesSearch && matchesStatus && matchesTech;
    });
  }, [bookings, searchTerm, selectedStatus, selectedTechnician]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In-Service':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Pending':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-[#F0EBE1] text-[#2B1E16] border-[#D8CEBE]';
    }
  };

  return (
    <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold">Salon Appointments Management</h3>
          <p className="text-xs text-[#4A3B32] mt-0.5">
            Total active bookings: <span className="font-semibold text-[#2B1E16]">{filteredBookings.length}</span> of {bookings.length}
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="bg-[#2B1E16] text-[#FAF8F5] px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4A3B32] transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>+</span> New Appointment
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A3B32]/60 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by client email, service, or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#4A3B32] hover:text-[#2B1E16]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Technician Select */}
          <div className="flex items-center gap-1.5 text-xs text-[#4A3B32]">
            <span>Technician:</span>
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
            >
              {technicians.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#F0EBE1] pb-4">
        {statusOptions.map(status => {
          const isSelected = selectedStatus === status;
          const count = status === 'All' 
            ? bookings.length 
            : bookings.filter(b => (b.status || 'Confirmed') === status).length;

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected 
                  ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-sm' 
                  : 'bg-[#FAF8F5] text-[#4A3B32] hover:bg-[#F0EBE1]'
              }`}
            >
              <span>{status}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E5DFD4] text-[#2B1E16]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointments Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0EBE1] text-[11px] uppercase tracking-wider text-[#4A3B32] font-semibold">
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Technician</th>
              <th className="py-3 px-4">Schedule</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status & Action</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBE1] text-xs">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#4A3B32]">
                  <p className="font-serif text-lg text-[#2B1E16] mb-1">No appointments found</p>
                  <p className="text-xs">Try adjusting your search query or status filter.</p>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking, index) => {
                const currentStatus = booking.status || 'Confirmed';

                return (
                  <tr key={booking._id || index} className="hover:bg-[#FAF8F5]/70 transition-colors">
                    
                    {/* Client info */}
                    <td className="py-4 px-4 font-medium text-[#2B1E16]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#F0EBE1] flex items-center justify-center text-[10px] font-bold text-[#2B1E16]">
                          {booking.userEmail ? booking.userEmail[0].toUpperCase() : 'U'}
                        </div>
                        <div className="max-w-[160px] truncate" title={booking.userEmail}>
                          <span className="block truncate">{booking.userEmail}</span>
                          {booking.notes && (
                            <span className="text-[10px] text-amber-700 italic block truncate">"{booking.notes}"</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4 font-serif text-[#2B1E16] font-medium">
                      {booking.serviceTitle}
                    </td>

                    {/* Technician */}
                    <td className="py-4 px-4 text-[#4A3B32]">
                      <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#F0EBE1] font-medium text-[#2B1E16]">
                        💅 {booking.technicianName}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-4 text-[#4A3B32]">
                      <div className="font-medium text-[#2B1E16]">{booking.time}</div>
                      <div className="text-[11px] text-[#4A3B32]/80">{booking.date}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-serif font-bold text-[#2B1E16]">
                      ${booking.totalAmount}
                    </td>

                    {/* Status & Live Selector */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${getStatusBadge(currentStatus)}`}>
                          {currentStatus}
                        </span>

                        <select
                          value={currentStatus}
                          onChange={(e) => onStatusChange(booking._id, e.target.value)}
                          className="bg-white border border-[#F0EBE1] text-[11px] rounded-lg px-2 py-1 text-[#2B1E16] hover:border-[#2B1E16] focus:outline-none cursor-pointer"
                          title="Change appointment status"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="In-Service">In-Service</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel / remove booking for ${booking.userEmail}?`)) {
                            onDeleteBooking(booking._id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-xs font-semibold cursor-pointer"
                        title="Remove booking"
                      >
                        Remove
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between text-xs text-[#4A3B32] pt-4 border-t border-[#F0EBE1]">
        <span>Showing {filteredBookings.length} of {bookings.length} salon appointments</span>
        <span className="text-[11px] text-[#4A3B32]/70">Status updates reflect live across the salon system</span>
      </div>

    </div>
  );
};

export default AppointmentsTable;
