// src/pages/Dashboard/LiveTracker.jsx
import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useNavigate } from 'react-router-dom';

const LiveTracker = () => {
  const { bookingData } = useBooking();
  const navigate = useNavigate();

  // Simulated live queue state (In a real backend, this would use WebSockets or polling)
  const [queueStatus, setQueueStatus] = useState({
    currentServingSlot: '01:00 PM',
    peopleAhead: 2,
    estimatedWaitMinutes: 25,
    status: 'On Schedule' // 'On Schedule', 'Slightly Delayed', 'Your Turn Soon'
  });

  // Simulated real-time countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setQueueStatus((prev) => {
        if (prev.estimatedWaitMinutes > 0) {
          return { ...prev, estimatedWaitMinutes: prev.estimatedWaitMinutes - 1 };
        }
        return prev;
      });
    }, 60000); // Reduce wait time by 1 minute every minute for demo purposes

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> Live Queue Active
          </span>
          <h1 className="text-3xl font-serif text-[#2B1E16]">Appointment Live Tracker</h1>
        </div>
        <button 
          onClick={() => navigate('/account')}
          className="text-sm font-medium text-[#4A3B32] hover:text-[#2B1E16] underline underline-offset-4"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Main Status Card */}
      <div className="bg-gradient-to-br from-[#2B1E16] to-[#4A3B32] text-[#FAF8F5] rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-2xl"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          
          {/* Your Slot Info */}
          <div className="border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
            <p className="text-xs uppercase tracking-widest text-[#FAF8F5]/70 mb-1">Your Booked Slot</p>
            <p className="text-3xl font-serif font-bold text-white mb-2">
              {bookingData.time || '01:30 PM'}
            </p>
            <p className="text-sm text-[#FAF8F5]/85">
              {bookingData.date || 'August 14, 2026'}
            </p>
          </div>

          {/* Estimated Wait Time */}
          <div className="border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6 text-center">
            <p className="text-xs uppercase tracking-widest text-[#FAF8F5]/70 mb-1">Estimated Wait Time</p>
            <p className="text-4xl font-serif font-bold text-white mb-1">
              ~{queueStatus.estimatedWaitMinutes} <span className="text-lg font-normal">mins</span>
            </p>
            <p className="text-xs text-green-300 font-medium">
              {queueStatus.status}
            </p>
          </div>

          {/* Current Salon Status */}
          <div className="text-center md:text-right">
            <p className="text-xs uppercase tracking-widest text-[#FAF8F5]/70 mb-1">Currently Serving</p>
            <p className="text-2xl font-serif text-white mb-1">
              Slot: {queueStatus.currentServingSlot}
            </p>
            <p className="text-xs text-[#FAF8F5]/80">
              {queueStatus.peopleAhead} people ahead of you
            </p>
          </div>

        </div>
      </div>

      {/* Progress Timeline / Slot Breakdown */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-serif text-[#2B1E16] mb-6">Today's Slot Timeline</h3>

        <div className="space-y-4">
          
          {/* Past Slot */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5]/50 border border-[#F0EBE1] opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs">✓</div>
              <div>
                <h4 className="font-medium text-[#2B1E16]">12:00 PM - 01:00 PM Slot</h4>
                <p className="text-xs text-[#4A3B32]">Completed successfully</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-200 text-gray-700 rounded-full">Finished</span>
          </div>

          {/* Active Slot */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">●</div>
              <div>
                <h4 className="font-medium text-[#2B1E16]">01:00 PM Slot (Active Now)</h4>
                <p className="text-xs text-[#4A3B32]">Technician is currently serving this appointment</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-200 text-amber-800 rounded-full">In Progress</span>
          </div>

          {/* User's Booked Slot */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#2B1E16] text-[#FAF8F5] shadow-md border border-[#2B1E16]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#2B1E16] flex items-center justify-center font-bold text-xs">You</div>
              <div>
                <h4 className="font-medium text-white">01:30 PM Slot (Your Booking)</h4>
                <p className="text-xs text-[#FAF8F5]/80">With {bookingData.technician?.name || 'Elena M.'} • {bookingData.service?.title || 'Signature Gel Manicure'}</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/20 text-white rounded-full">Up Next</span>
          </div>

          {/* Future Slot */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#F0EBE1]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#E8DCC8] text-[#4A3B32] flex items-center justify-center font-bold text-xs">4</div>
              <div>
                <h4 className="font-medium text-[#2B1E16]">02:00 PM Slot</h4>
                <p className="text-xs text-[#4A3B32]">Waiting in queue</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">Upcoming</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LiveTracker;