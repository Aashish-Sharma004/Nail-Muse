// src/pages/Booking/Confirmation.jsx
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useEffect } from 'react';

const Confirmation = () => {
  const navigate = useNavigate();
  const { bookingData, resetBooking } = useBooking();

  // Jab user page chode, toh data reset kar do
  useEffect(() => {
    return () => resetBooking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      
      <h1 className="text-4xl font-serif text-[#2B1E16] mb-4">Your appointment is confirmed!</h1>
      <p className="text-lg text-[#4A3B32] mb-10">We're looking forward to seeing you. Your booking ID is NM-12345</p>

      <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 text-left max-w-lg mx-auto shadow-sm mb-10">
        <h3 className="font-medium text-xs uppercase tracking-wider text-[#4A3B32] mb-2">Appointment Details</h3>
        <p className="text-lg font-serif text-[#2B1E16]">{bookingData.service?.title || 'Signature Service'}</p>
        <p className="text-[#4A3B32] mb-4">with {bookingData.technician?.name || 'Assigned Technician'}</p>
        
        <div className="flex items-center gap-2 text-sm text-[#4A3B32]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {bookingData.date || 'To be determined'} • {bookingData.time}
        </div>
      </div>

      <button 
        onClick={() => navigate('/account')}
        className="bg-[#2B1E16] text-[#FAF8F5] px-8 py-3.5 rounded-xl font-medium hover:bg-[#4A3B32] transition-all"
      >
        Go to My Account
      </button>
    </div>
  );
};
export default Confirmation;