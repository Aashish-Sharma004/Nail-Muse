// src/pages/Booking/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { createBooking } from '../../services/api';
import {
  Tag,
  CreditCard,
  Building2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ArrowLeft,
  X,
  Sparkles,
  Lock
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    bookingData,
    updateBooking,
    applyCoupon,
    removeCoupon,
    getCalculations,
    validCoupons
  } = useBooking();
  const { user, isLoggedIn } = useAuth();

  const [inputCoupon, setInputCoupon] = useState(bookingData.couponCode || '');
  const [couponMessage, setCouponMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(bookingData.paymentMethod || 'Pay in Studio');
  const [notes, setNotes] = useState(bookingData.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle case where user directly visits checkout without booking data
  if (!bookingData.service) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <h2 className="text-2xl font-serif text-[#2B1E16] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          No Active Reservation Found
        </h2>
        <p className="text-sm text-[#6B5344] mb-6">Please choose your preferred salon service to begin.</p>
        <button
          onClick={() => navigate('/services')}
          className="px-6 py-3 bg-[#2B1E16] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#4A3B32] transition-colors"
        >
          Explore Services &rarr;
        </button>
      </div>
    );
  }

  const {
    basePrice,
    addonsTotal,
    serviceFee,
    subtotal,
    discount,
    total,
    rewardPoints
  } = getCalculations();

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    if (!inputCoupon.trim()) return;

    const result = applyCoupon(inputCoupon);
    setCouponMessage(result);
    if (!result.success) {
      setTimeout(() => setCouponMessage(null), 4000);
    }
  };

  const handleQuickApply = (code) => {
    setInputCoupon(code);
    const result = applyCoupon(code);
    setCouponMessage(result);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setInputCoupon('');
    setCouponMessage(null);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate user authentication
      if (!isLoggedIn || !user) {
        navigate('/login');
        return;
      }

      const bookingPayload = {
        userEmail: user.email,
        serviceTitle: bookingData.service?.title || 'Signature Service',
        technicianName: bookingData.technician?.name || 'Assigned Specialist',
        date: bookingData.date || new Date().toLocaleDateString(),
        time: bookingData.time || '10:00 AM',
        basePrice,
        addons: bookingData.addons || [],
        serviceFee,
        discount,
        couponCode: bookingData.couponCode || '',
        paymentMethod,
        totalAmount: Number(total.toFixed(2)),
        notes: notes.trim()
      };

      // Save booking to backend MongoDB database
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
          paymentMethod,
          notes,
          confirmedBooking: createdBooking
        });
      }

      // Navigate to confirmation page
      navigate('/booking/confirmation');
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      
      {/* Top Header */}
      <button
        onClick={() => navigate('/booking/review')}
        className="text-xs font-bold text-[#6B5344] hover:text-[#2B1E16] mb-4 flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Review & Add-ons
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs uppercase tracking-widest text-[#4A3B32] font-semibold">Step 4 of 4</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#2B1E16]"></span>
        <span className="text-xs text-[#4A3B32]">Final Checkout & Offers</span>
      </div>

      <h1 className="text-3xl md:text-4xl text-[#2B1E16] font-serif font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
        Complete Your Reservation
      </h1>
      <p className="text-sm text-[#4A3B32] mb-8">
        Apply promotional discount vouchers, choose your preferred payment option, and confirm your salon booking.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Payment Choice, Coupons & Notes */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Coupon & Voucher Application Box */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE1]">
              <Tag size={16} className="text-amber-800" />
              <h3 className="font-serif text-base font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Apply Promo Code or Offer Voucher
              </h3>
            </div>

            {bookingData.couponCode ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-xs text-emerald-950 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      {bookingData.couponCode}
                    </span>
                    <span className="text-xs text-emerald-900 font-semibold ml-2">
                      Saved ${discount.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-emerald-800 mt-0.5">
                      {bookingData.couponDetails?.desc || 'Promotional offer applied successfully'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100/60 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Remove coupon"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g. GLAM20, VIPGEMS)"
                    className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs font-mono font-bold text-[#2B1E16] uppercase focus:outline-none focus:border-[#2B1E16] placeholder:normal-case placeholder:font-sans"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2B1E16] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#4A3B32] transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    Apply Code
                  </button>
                </div>

                {couponMessage && (
                  <p className={`text-xs ${couponMessage.success ? 'text-emerald-700 font-bold' : 'text-rose-600'}`}>
                    {couponMessage.message}
                  </p>
                )}

                {/* Quick 1-Click Suggestion Chips */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-[#6B5344] block mb-1.5 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-600" /> Active Salon Offers (Click to Apply)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(validCoupons).slice(0, 4).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleQuickApply(c.code)}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EDE5D8] text-[11px] font-mono font-semibold text-[#2B1E16] hover:border-[#2B1E16] hover:bg-white transition-all cursor-pointer"
                      >
                        🏷️ {c.code} <span className="text-amber-800 font-bold">({c.label})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2B1E16] pb-2 border-b border-[#F0EBE1]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Select Payment Method
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'Pay in Studio',
                  label: 'Pay in Studio / Salon Upon Visit',
                  sub: 'Pay with Cash, Card, or UPI directly at our reception desk',
                  icon: <Building2 size={20} className="text-amber-800" />
                },
                {
                  id: 'Card',
                  label: 'Credit / Debit Card Online',
                  sub: 'Secure Instant Checkout via Stripe (Visa, Mastercard, Amex)',
                  icon: <CreditCard size={20} className="text-blue-800" />
                },
                {
                  id: 'UPI',
                  label: 'UPI / Instant QR Payment',
                  sub: 'Instant contactless payment using GPay, PhonePe, or Paytm',
                  icon: <QrCode size={20} className="text-emerald-800" />
                }
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    paymentMethod === opt.id
                      ? 'bg-[#FAF8F5] border-[#2B1E16] shadow-2xs ring-1 ring-[#2B1E16]'
                      : 'bg-white border-[#EDE5D8] hover:bg-[#FAF8F5]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="w-4 h-4 text-[#2B1E16] focus:ring-[#2B1E16]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#2B1E16] block">{opt.label}</span>
                      <span className="text-[11px] text-[#6B5344] block mt-0.5">{opt.sub}</span>
                    </div>
                  </div>
                  <div className="shrink-0">{opt.icon}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Client Notes & Requests */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-2">
            <label className="text-xs uppercase font-bold text-[#6B5344] block">
              Special Requests or Nail Color Preferences (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Short almond shape, prefer matte top coat, sensitive cuticles..."
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] leading-relaxed"
            />
          </div>

        </div>

        {/* Right Column (5 cols): Itemized Real-Cost Bill & Checkout Button */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 shadow-lg space-y-5 sticky top-24">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
              <h3 className="font-serif text-xl font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Itemized Summary
              </h3>
              <span className="text-[10px] uppercase font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#EDE5D8] text-[#6B5344]">
                Final Cost
              </span>
            </div>

            {/* Service brief */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] text-xs space-y-1">
              <p className="font-bold font-serif text-[#2B1E16] text-sm">
                {bookingData.service?.title}
              </p>
              <p className="text-[#6B5344] text-[11px]">
                Artist: <strong className="text-[#2B1E16]">{bookingData.technician?.name || 'Assigned Specialist'}</strong>
              </p>
              <p className="text-[#6B5344] text-[11px]">
                Schedule: <strong className="text-[#2B1E16]">{bookingData.date || 'Today'} at {bookingData.time || '10:00 AM'}</strong>
              </p>
            </div>

            {/* Line-by-Line Breakdown */}
            <div className="space-y-2.5 text-xs text-[#4A3B32]">
              {/* Base */}
              <div className="flex justify-between items-center">
                <span>Base Service</span>
                <span className="font-semibold text-[#2B1E16]">${basePrice.toFixed(2)}</span>
              </div>

              {/* Addons */}
              {bookingData.addons && bookingData.addons.length > 0 && (
                bookingData.addons.map((a, i) => (
                  <div key={i} className="flex justify-between items-center text-[#6B5344] pl-2 border-l-2 border-[#d4956b]">
                    <span>+ {a.name}</span>
                    <span className="font-semibold text-[#2B1E16]">+${Number(a.price).toFixed(2)}</span>
                  </div>
                ))
              )}

              {/* Fee */}
              <div className="flex justify-between items-center text-[#6B5344]">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-700" />
                  Sanitation & Eco Fee
                </span>
                <span className="font-semibold text-[#2B1E16]">${serviceFee.toFixed(2)}</span>
              </div>

              {/* Discount if present */}
              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Tag size={12} /> Voucher ({bookingData.couponCode})
                  </span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-[#EDE5D8] my-3"></div>

              {/* Final Real Total */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B5344] block">Total Real Cost Due</span>
                  <span className="text-[10px] text-[#8A7363]">All taxes & charges included</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-serif font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Loyalty points banner */}
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2">
              <Coins size={16} className="text-amber-700 shrink-0" />
              <span>
                Earn <strong>+{rewardPoints} Loyalty Points</strong> on service completion
              </span>
            </div>

            {/* Confirm & Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#2B1E16] text-[#FAF8F5] py-4 rounded-2xl text-sm font-bold hover:bg-[#4A3B32] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Lock size={15} />
              {loading
                ? 'Processing Reservation...'
                : paymentMethod === 'Pay in Studio'
                ? `Confirm Booking — $${total.toFixed(2)}`
                : `Pay & Confirm — $${total.toFixed(2)}`}
            </button>

            <p className="text-[10px] text-center text-[#8A7363] flex items-center justify-center gap-1">
              <Lock size={11} /> 256-Bit SSL Encrypted Salon Booking & Payment
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;