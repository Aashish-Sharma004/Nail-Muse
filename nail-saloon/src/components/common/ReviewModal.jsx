// src/components/common/ReviewModal.jsx
import { useState } from 'react';

const ReviewModal = ({ isOpen, onClose }) => {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1E16]/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-[#F0EBE1] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#4A3B32] hover:text-[#2B1E16]">✕</button>

        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h3 className="text-2xl font-serif text-[#2B1E16] mb-2">Thank You!</h3>
            <p className="text-[#4A3B32]">Your review has been successfully submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-serif text-[#2B1E16] mb-2">How was your visit?</h2>
            <p className="text-sm text-[#4A3B32] mb-6">We'd love to hear about your experience at NailMuse Studio.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Service Quality</label>
                <div className="flex gap-2 text-xl cursor-pointer">⭐⭐⭐⭐⭐</div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Technician Professionalism</label>
                <div className="flex gap-2 text-xl cursor-pointer">⭐⭐⭐⭐⭐</div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Salon Atmosphere</label>
                <div className="flex gap-2 text-xl cursor-pointer">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Share more about your experience</label>
              <textarea 
                rows="3" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love? Is there anything we could improve?" 
                className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#2B1E16]"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="w-1/2 py-3 border border-[#F0EBE1] rounded-xl text-sm font-medium text-[#4A3B32]">Skip</button>
              <button type="submit" className="w-1/2 py-3 bg-[#2B1E16] text-[#FAF8F5] rounded-xl text-sm font-medium hover:bg-[#4A3B32]">Submit Review</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;