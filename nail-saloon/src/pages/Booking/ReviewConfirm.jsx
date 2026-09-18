// src/pages/Booking/ReviewConfirm.jsx
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import {
  Sparkles,
  Scissors,
  User,
  Calendar,
  Clock,
  Check,
  Plus,
  ShieldCheck,
  Coins,
  ArrowRight,
  ArrowLeft,
  Tag
} from 'lucide-react';

const ReviewConfirm = () => {
  const navigate = useNavigate();
  const {
    bookingData,
    toggleAddon,
    availableAddons,
    getCalculations
  } = useBooking();

  // If no service selected, fallback or redirect
  const service = bookingData?.service || {
    title: 'Signature Gel Manicure',
    price: '$55+',
    numericPrice: 55,
    duration: '50 mins'
  };

  const technician = bookingData?.technician || {
    name: 'Elena M.',
    role: 'Master Nail Artist'
  };

  const bookingDate = bookingData?.date || 'August 22, 2026';
  const bookingTime = bookingData?.time || '10:00 AM';

  const selectedAddons = bookingData?.addons || [];
  const {
    basePrice,
    addonsTotal,
    serviceFee,
    subtotal,
    discount,
    total,
    rewardPoints
  } = getCalculations();

  const isAddonSelected = (addon) => {
    return selectedAddons.some((a) => a.name === addon.name || a.id === addon.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      
      {/* Top Breadcrumb Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-[#6B5344] hover:text-[#2B1E16] mb-4 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Date & Time
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-[#4A3B32] font-semibold">Step 3 of 4</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2B1E16]"></span>
          <span className="text-xs text-[#4A3B32]">Review & Customize</span>
        </div>

        <h1 className="text-3xl md:text-4xl text-[#2B1E16] font-serif font-bold" style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.2' }}>
          Review Your Appointment & Add-ons
        </h1>
        <p className="text-sm md:text-base text-[#4A3B32] mt-2">
          Verify your treatment details, personalize with luxury spa add-ons, and review your transparent price breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Details & Addon Selector */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Selected Treatment & Artist Card */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B5344]">
                Core Service Reservation
              </span>
              <button
                onClick={() => navigate('/services')}
                className="text-xs font-semibold text-amber-900 hover:underline cursor-pointer"
              >
                Change Service
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] flex items-center justify-center text-[#2B1E16] text-xl shrink-0">
                💅
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-serif font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    {service.title}
                  </h3>
                  <span className="text-lg font-serif font-bold text-[#2B1E16]">
                    ${basePrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#6B5344] mt-1 flex items-center gap-1.5">
                  <Clock size={13} /> {service.duration || '45-60 mins'}
                </p>
              </div>
            </div>

            {/* Specialist, Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#EDE5D8] flex items-center justify-center text-[#2B1E16] shrink-0 text-sm">
                  👩‍🎨
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#6B5344]">Stylist</p>
                  <p className="text-xs font-bold text-[#2B1E16]">{technician.name}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#EDE5D8] flex items-center justify-center text-[#2B1E16] shrink-0 text-sm">
                  📅
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#6B5344]">Schedule</p>
                  <p className="text-xs font-bold text-[#2B1E16]">{bookingDate} • {bookingTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Add-on Services Selector */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE1]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Customize With Luxury Add-ons
                </h3>
                <p className="text-xs text-[#6B5344]">
                  Tap to add or remove bespoke enhancements for your visit
                </p>
              </div>
              <span className="text-xs font-bold bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EDE5D8] text-[#2B1E16]">
                {selectedAddons.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {availableAddons.map((addon) => {
                const selected = isAddonSelected(addon);

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      selected
                        ? 'bg-[#FAF8F5] border-[#2B1E16] shadow-2xs ring-1 ring-[#2B1E16]'
                        : 'bg-white border-[#EDE5D8] hover:border-[#2B1E16]/40 hover:bg-[#FAF8F5]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl mt-0.5">{addon.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2B1E16]">
                            {addon.name}
                          </h4>
                          <span className="text-[10px] text-[#6B5344] font-medium bg-white px-2 py-0.5 rounded-full border border-[#EDE5D8]">
                            +{addon.duration}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B5344] mt-0.5 leading-relaxed">
                          {addon.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-serif font-bold text-sm text-[#2B1E16]">
                        +${addon.price}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          selected
                            ? 'bg-[#2B1E16] text-[#FAF8F5]'
                            : 'bg-[#FAF8F5] border border-[#EDE5D8] text-[#6B5344]'
                        }`}
                      >
                        {selected ? <Check size={14} /> : <Plus size={14} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Itemized Real-Cost Bill & Checkout CTA */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Bill Breakdown Card */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <h3 className="font-serif text-xl font-bold text-[#2B1E16] pb-3 border-b border-[#F0EBE1]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Price & Cost Breakdown
            </h3>

            {/* Line Items */}
            <div className="space-y-3 text-xs text-[#4A3B32]">
              {/* Base Service */}
              <div className="flex justify-between items-center">
                <span className="text-[#2B1E16] font-medium">{service.title} (Base)</span>
                <span className="font-semibold text-[#2B1E16]">${basePrice.toFixed(2)}</span>
              </div>

              {/* Addons Listing */}
              {selectedAddons.length > 0 ? (
                selectedAddons.map((addon, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[#6B5344] pl-2 border-l-2 border-[#d4956b]">
                    <span>+ {addon.name}</span>
                    <span className="font-semibold text-[#2B1E16]">+${Number(addon.price).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-[#8A7363] italic pl-2 border-l-2 border-gray-200">
                  No add-ons selected
                </div>
              )}

              {/* Service Fee */}
              <div className="flex justify-between items-center text-[#6B5344]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Salon Sterilization & Eco Fee
                </span>
                <span className="font-semibold text-[#2B1E16]">${serviceFee.toFixed(2)}</span>
              </div>

              {/* Discount / Coupon if applied */}
              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} />
                    Offer Discount ({bookingData.couponCode})
                  </span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-[#EDE5D8] my-3"></div>

              {/* Total Due */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B5344] block">Total Real Cost Due</span>
                  <span className="text-[10px] text-[#8A7363]">Taxes & sterilization included</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-serif font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Reward Points banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2.5">
              <Coins size={18} className="text-amber-700 shrink-0" />
              <div>
                <p className="font-bold text-amber-900">
                  +{rewardPoints} Loyalty Points Earned
                </p>
                <p className="text-[11px] text-amber-800/80">
                  Automatically added to your account upon appointment completion
                </p>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/booking/checkout')}
              className="w-full bg-[#2B1E16] text-[#FAF8F5] py-4 rounded-2xl text-sm font-bold hover:bg-[#4A3B32] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Proceed to Checkout</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs">${total.toFixed(2)}</span>
              <ArrowRight size={15} />
            </button>

            <p className="text-[11px] text-center text-[#8A7363]">
              You can apply promo coupons and select payment methods on the next page.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ReviewConfirm;