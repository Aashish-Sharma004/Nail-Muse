// src/pages/Booking/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { createBooking } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle case where user directly visits checkout without booking data
  if (!bookingData.service) {
    return (
      <div className="text-center py-20">
        <p>No booking found. Please start from the beginning.</p>
        <button onClick={() => navigate('/services')} className="mt-4 text-[#2B1E16] underline">Go to Services</button>
      </div>
    );
  }

  const subtotal = (bookingData.service.price || 0) + (bookingData.addons?.reduce((acc, a) => acc + a.price, 0) || 0);
  const total = Math.max(0, subtotal - (bookingData.discount || 0));

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate logged-in user details from global AuthContext
      if (!isLoggedIn || !user) {
        navigate('/login');
        return;
      }

      // Prepare booking payload for MongoDB backend
      const bookingPayload = {
        userEmail: user.email,
        serviceTitle: bookingData.service.title || 'Signature Service',
        technicianName: bookingData.technician?.name || 'Assigned Specialist',
        date: bookingData.date || new Date().toLocaleDateString(),
        time: bookingData.time || '10:00 AM',
        totalAmount: total
      };

      // Save booking to backend database via environment-configured API service
      const res = await createBooking(bookingPayload);
      const createdBooking = res.data?.booking || {
        ...bookingPayload,
        _id: 'NM-' + Date.now().toString().slice(-6)
      };

      // Persist latest confirmed booking so LiveTracker and Confirmation have full access
      localStorage.setItem('nailmuse_latest_booking', JSON.stringify(createdBooking));
      if (typeof updateBooking === 'function') {
        updateBooking({
          ...bookingData,
          ...createdBooking,
          confirmedBooking: createdBooking
        });
      }

      // Navigate to confirmation page
      navigate('/booking/confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-sm text-[#4A3B32] mb-6 hover:text-[#2B1E16]">&larr; Back</button>

      <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 md:p-10 shadow-lg">
        <h2 className="text-3xl font-serif text-[#2B1E16] mb-6 text-center">Complete your payment</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-[#FAF8F5] rounded-xl p-6 mb-8 border border-[#F0EBE1]">
          <div className="flex justify-between items-center">
            <span className="text-lg font-serif text-[#2B1E16]">Total Due</span>
            <span className="text-2xl font-serif text-[#2B1E16]">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4 mb-8">
          <label className="flex items-center justify-between p-4 border border-[#2B1E16] rounded-xl bg-[#FAF8F5] cursor-pointer">
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-[#2B1E16] focus:ring-[#2B1E16]" />
              <span className="font-medium text-[#2B1E16]">Pay with Card</span>
            </div>
            <span className="text-xl">💳</span>
          </label>
          <label className="flex items-center justify-between p-4 border border-[#F0EBE1] rounded-xl hover:bg-[#FAF8F5] cursor-pointer">
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" className="w-4 h-4 text-[#2B1E16] focus:ring-[#2B1E16]" />
              <span className="font-medium text-[#4A3B32]">Pay in Studio</span>
            </div>
            <span className="text-xl">🏢</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B1E16] text-[#FAF8F5] px-6 py-4 rounded-xl text-base font-semibold hover:bg-[#4A3B32] transition-all mt-6 shadow-xl disabled:opacity-50"
          >
            {loading ? 'Processing Booking...' : `Confirm & Pay ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Checkout;