// src/components/dashboard/NewBookingModal.jsx
import React, { useState } from 'react';

const NewBookingModal = ({ isOpen, onClose, onCreateBooking }) => {
  const services = [
    { title: 'Signature Gel Manicure', price: 65 },
    { title: 'Luxury Spa Pedicure', price: 75 },
    { title: 'Custom Nail Art Set', price: 90 },
    { title: 'Gel-X Extensions', price: 85 },
    { title: 'Japanese Organic Nail Care', price: 50 },
    { title: 'Express Polish & Shape', price: 35 },
  ];

  const technicians = ['Elena M.', 'Mia K.', 'Sarah T.', 'Chloe L.'];
  const timeSlots = ['09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];

  const [formData, setFormData] = useState({
    userEmail: '',
    serviceTitle: services[0].title,
    technicianName: technicians[0],
    date: new Date().toISOString().split('T')[0],
    time: timeSlots[1],
    totalAmount: services[0].price,
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleServiceChange = (e) => {
    const selectedTitle = e.target.value;
    const found = services.find(s => s.title === selectedTitle);
    setFormData(prev => ({
      ...prev,
      serviceTitle: selectedTitle,
      totalAmount: found ? found.price : 60
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userEmail) {
      alert('Please enter a client email');
      return;
    }

    setLoading(true);
    try {
      await onCreateBooking(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-[#4A3B32] hover:text-[#2B1E16] text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold mb-1">
          Create Walk-In Appointment
        </h3>
        <p className="text-xs text-[#4A3B32] mb-6">
          Schedule a client visit directly into the salon system
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Email */}
          <div>
            <label className="block text-[#4A3B32] font-semibold mb-1">Client Email</label>
            <input
              type="email"
              required
              placeholder="e.g. client@example.com"
              value={formData.userEmail}
              onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />
          </div>

          {/* Service & Technician row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4A3B32] font-semibold mb-1">Service</label>
              <select
                value={formData.serviceTitle}
                onChange={handleServiceChange}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
              >
                {services.map(s => (
                  <option key={s.title} value={s.title}>{s.title} (${s.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#4A3B32] font-semibold mb-1">Stylist / Artist</label>
              <select
                value={formData.technicianName}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
              >
                {technicians.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4A3B32] font-semibold mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
              />
            </div>

            <div>
              <label className="block text-[#4A3B32] font-semibold mb-1">Time Slot</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Amount & Notes */}
          <div>
            <label className="block text-[#4A3B32] font-semibold mb-1">Amount ($ USD)</label>
            <input
              type="number"
              min="0"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />
          </div>

          <div>
            <label className="block text-[#4A3B32] font-semibold mb-1">Client Notes / Request (Optional)</label>
            <input
              type="text"
              placeholder="e.g. French tips, gentle cuticle care"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#F0EBE1] text-[#4A3B32] font-medium hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#2B1E16] text-[#FAF8F5] font-semibold rounded-xl hover:bg-[#4A3B32] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default NewBookingModal;
