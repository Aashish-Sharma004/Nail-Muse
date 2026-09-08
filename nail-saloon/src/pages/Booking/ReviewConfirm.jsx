// src/pages/Booking/ReviewConfirm.jsx
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const ReviewConfirm = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  const total = bookingData.service.price + bookingData.addons[0].price - bookingData.discount;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-sm text-[#4A3B32] mb-6 hover:text-[#2B1E16]">&larr; Back</button>
      <h2 className="text-3xl font-serif text-[#2B1E16] mb-6">Review & Confirm</h2>
      
      <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 mb-6 shadow-sm">
        <h3 className="font-medium text-xs uppercase tracking-wider text-[#4A3B32] mb-2">Service</h3>
        <p className="text-lg font-serif text-[#2B1E16]">{bookingData.service.title} ({bookingData.service.duration})</p>
        
        <div className="border-t border-[#F0EBE1] my-4"></div>
        <h3 className="font-medium text-xs uppercase tracking-wider text-[#4A3B32] mb-2">Date, Time & Tech</h3>
        <p className="text-lg font-serif text-[#2B1E16]">{bookingData.date} at {bookingData.time}</p>
        <p className="text-[#4A3B32]">with {bookingData.technician?.name}</p>
      </div>

      <div className="bg-[#FAF8F5] border border-[#F0EBE1] rounded-2xl p-6 mb-8">
        <h3 className="font-serif text-lg mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm text-[#4A3B32]">
          <div className="flex justify-between"><span>Base Service</span><span>${bookingData.service.price}</span></div>
          <div className="flex justify-between"><span>{bookingData.addons[0].name}</span><span>${bookingData.addons[0].price}</span></div>
          <div className="flex justify-between text-green-700"><span>New Customer 20% Off</span><span>-${bookingData.discount}</span></div>
        </div>
        <div className="border-t border-[#E8DCC8] my-3"></div>
        <div className="flex justify-between items-center text-xl font-serif text-[#2B1E16]">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={() => navigate('/booking/checkout')} className="w-full bg-[#2B1E16] text-[#FAF8F5] py-4 rounded-xl text-base font-semibold">
        Confirm Appointment & Pay &rarr;
      </button>
    </div>
  );
};
export default ReviewConfirm;