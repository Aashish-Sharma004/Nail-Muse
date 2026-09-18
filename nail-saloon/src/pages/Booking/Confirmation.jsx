// src/pages/Booking/Confirmation.jsx
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle2, Clock, Calendar, User, Scissors, ArrowRight, Radio } from 'lucide-react';

const Confirmation = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  // Try to retrieve latest confirmed booking from context or localStorage
  let booking = bookingData?.confirmedBooking || bookingData;
  if (!booking?.service && !booking?.serviceTitle) {
    try {
      const stored = localStorage.getItem('nailmuse_latest_booking');
      if (stored) booking = JSON.parse(stored);
    } catch {}
  }

  const bookingId = booking?._id
    ? `NM-${String(booking._id).slice(-5).toUpperCase()}`
    : 'NM-78492';

  const serviceName = booking?.serviceTitle || booking?.service?.title || 'Signature Service';
  const technicianName = booking?.technicianName || booking?.technician?.name || 'Assigned Master Artist';
  const bookingDate = booking?.date || 'Today';
  const bookingTime = booking?.time || '10:00 AM';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 size={44} className="text-emerald-700" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
        Booking Confirmed & Live
      </span>

      <h1 className="text-3xl md:text-4xl font-serif text-[#2B1E16] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
        Your appointment is booked!
      </h1>
      <p className="text-sm md:text-base text-[#4A3B32] mb-8 max-w-md mx-auto leading-relaxed">
        We're excited to pamper you. Your official reservation code is <strong className="font-mono text-[#2B1E16] bg-[#F5EFE6] px-2 py-0.5 rounded-md border border-[#EDE5D8]">{bookingId}</strong>
      </p>

      {/* Appointment Details Card */}
      <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 text-left shadow-sm mb-8 space-y-5">
        <div className="flex justify-between items-center pb-4 border-b border-[#F0EBE1]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A3B32]">
            Appointment Summary
          </span>
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <Radio size={12} className="animate-pulse text-amber-700" /> Live Queue Ready
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EDE5D8] flex items-center justify-center text-[#2B1E16] shrink-0">
              <Scissors size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-[#4A3B32]/70 tracking-wider">Service Treatment</p>
              <h3 className="text-lg font-serif font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {serviceName}
              </h3>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EDE5D8] flex items-center justify-center text-[#2B1E16] shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-[#4A3B32]/70 tracking-wider">Assigned Technician</p>
              <p className="text-sm font-semibold text-[#2B1E16]">{technicianName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8]">
              <Calendar size={16} className="text-[#4A3B32]" />
              <div>
                <p className="text-[10px] uppercase font-bold text-[#4A3B32]/70">Date</p>
                <p className="text-xs font-bold text-[#2B1E16]">{bookingDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8]">
              <Clock size={16} className="text-[#4A3B32]" />
              <div>
                <p className="text-[10px] uppercase font-bold text-[#4A3B32]/70">Booked Slot</p>
                <p className="text-xs font-bold text-[#2B1E16]">{bookingTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Clock size={16} className="shrink-0 text-amber-800 mt-0.5" />
          <span>
            You can now watch the salon's live station queue, estimated wait time, and your spot in real time on the Live Tracker.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button 
          onClick={() => navigate('/booking/tracker')}
          className="w-full sm:w-auto bg-[#2B1E16] text-[#FAF8F5] px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-[#4A3B32] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🕒</span> Track Live Queue Now <ArrowRight size={15} />
        </button>
        <button 
          onClick={() => navigate('/account')}
          className="w-full sm:w-auto bg-white border border-[#EDE5D8] text-[#2B1E16] px-6 py-3.5 rounded-2xl font-semibold text-sm hover:bg-[#FAF8F5] transition-all cursor-pointer"
        >
          Go to My Account
        </button>
      </div>

    </div>
  );
};

export default Confirmation;