// src/context/BookingContext.jsx
import { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const LUXURY_ADDONS = [
  {
    id: 'minimal_art',
    name: 'Minimalist Nail Art (French / Accents)',
    price: 15,
    duration: '15 mins',
    icon: '💅',
    desc: 'Chic French tips, micro-dots, or fine negative space geometric lines'
  },
  {
    id: 'gem_3d',
    name: '3D Sculpting & Swarovski Crystal Gems',
    price: 20,
    duration: '20 mins',
    icon: '💎',
    desc: 'Opulent Swarovski crystals, chrome shimmer, or 3D floral accents'
  },
  {
    id: 'paraffin_wrap',
    name: 'Warm Botanical Paraffin Hand Wrap',
    price: 15,
    duration: '15 mins',
    icon: '🧤',
    desc: 'Deep heat moisture therapy for velvety, supple hands'
  },
  {
    id: 'ibx_repair',
    name: 'IBX Deep Nail Plate Strengthening',
    price: 18,
    duration: '15 mins',
    icon: '✨',
    desc: 'Penetrating treatment repairing weak or peeling nail beds'
  },
  {
    id: 'gentle_removal',
    name: 'Gel / Gel-X Gentle Soak-Off Removal',
    price: 12,
    duration: '15 mins',
    icon: '🪄',
    desc: 'Damage-free professional removal before your fresh set'
  },
  {
    id: 'cuticle_elixir',
    name: 'Organic Cuticle Rejuvenation Therapy',
    price: 10,
    duration: '10 mins',
    icon: '🌿',
    desc: 'Pure jojoba & vitamin E hot oil massage for cuticle restoration'
  }
];

export const VALID_COUPONS = {
  WELCOME20: { code: 'WELCOME20', type: 'percentage', value: 20, label: '20% OFF', desc: 'Welcome 20% discount on entire session' },
  GLAM20: { code: 'GLAM20', type: 'percentage', value: 20, label: '20% OFF', desc: 'Spring Glam 20% promotional discount' },
  VIPGEMS: { code: 'VIPGEMS', type: 'fixed', value: 15, label: '$15 OFF', desc: 'Complimentary $15 Nail Art & Spa credit' },
  VIP15: { code: 'VIP15', type: 'fixed', value: 15, label: '$15 OFF', desc: 'VIP Member $15 discount' },
  PEDIPAMPER: { code: 'PEDIPAMPER', type: 'percentage', value: 15, label: '15% OFF', desc: 'Weekend Spa 15% discount' },
  SUMMER15: { code: 'SUMMER15', type: 'percentage', value: 15, label: '15% OFF', desc: 'Summer special 15% discount' },
  THANKYOU10: { code: 'THANKYOU10', type: 'percentage', value: 10, label: '10% OFF', desc: 'Client appreciation 10% discount' },
  FIRST50: { code: 'FIRST50', type: 'fixed', value: 50, minTotal: 80, label: '$50 OFF', desc: '$50 off on premium services over $80' }
};

// Helper to extract clean numerical price from price string e.g. "$45+" -> 45
export const parsePrice = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 45;
  const cleaned = String(priceVal).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 45 : parsed;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    service: {
      id: 1,
      title: 'Signature Gel Manicure',
      price: '$55+',
      numericPrice: 55,
      duration: '50 mins'
    },
    technician: null,
    date: null,
    time: null,
    addons: [
      { id: 'minimal_art', name: 'Minimalist Nail Art (French / Accents)', price: 15 }
    ],
    serviceFee: 3.50, // Standard Salon Sanitation & Hygiene Fee
    discount: 0,
    couponCode: '',
    couponDetails: null,
    paymentMethod: 'Pay in Studio',
    notes: ''
  });

  const updateBooking = (newData) => {
    setBookingData((prev) => {
      // If service is being updated, ensure numericPrice is properly parsed
      let updatedService = prev.service;
      if (newData.service) {
        const num = parsePrice(newData.service.price || newData.service.numericPrice || 45);
        updatedService = {
          ...newData.service,
          numericPrice: num
        };
      }

      return {
        ...prev,
        ...newData,
        ...(newData.service ? { service: updatedService } : {})
      };
    });
  };

  const toggleAddon = (addon) => {
    setBookingData((prev) => {
      const currentAddons = prev.addons || [];
      const exists = currentAddons.some((a) => a.name === addon.name || a.id === addon.id);

      let nextAddons;
      if (exists) {
        nextAddons = currentAddons.filter((a) => a.name !== addon.name && a.id !== addon.id);
      } else {
        nextAddons = [...currentAddons, { id: addon.id, name: addon.name, price: Number(addon.price) || 0 }];
      }

      // Recalculate discount if coupon is percentage based
      let updatedDiscount = prev.discount;
      if (prev.couponDetails) {
        const base = parsePrice(prev.service?.numericPrice || prev.service?.price || 45);
        const addonsCost = nextAddons.reduce((acc, a) => acc + (Number(a.price) || 0), 0);
        const subtotal = base + addonsCost + (prev.serviceFee || 3.50);

        if (prev.couponDetails.type === 'percentage') {
          updatedDiscount = Math.round((subtotal * prev.couponDetails.value) / 100);
        }
      }

      return {
        ...prev,
        addons: nextAddons,
        discount: updatedDiscount
      };
    });
  };

  const applyCoupon = (rawCode) => {
    if (!rawCode || !rawCode.trim()) {
      return { success: false, message: 'Please enter a voucher or promo code.' };
    }

    const code = rawCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];

    if (!coupon) {
      return {
        success: false,
        message: `Invalid coupon code "${code}". Try WELCOME20, GLAM20, or VIPGEMS.`
      };
    }

    const base = parsePrice(bookingData.service?.numericPrice || bookingData.service?.price || 45);
    const addonsCost = (bookingData.addons || []).reduce((acc, a) => acc + (Number(a.price) || 0), 0);
    const subtotal = base + addonsCost + (bookingData.serviceFee || 3.50);

    if (coupon.minTotal && subtotal < coupon.minTotal) {
      return {
        success: false,
        message: `Coupon ${code} requires a minimum order of $${coupon.minTotal}. Current: $${subtotal.toFixed(2)}`
      };
    }

    let calculatedDiscount = 0;
    if (coupon.type === 'percentage') {
      calculatedDiscount = Math.round((subtotal * coupon.value) / 100);
    } else {
      calculatedDiscount = Math.min(subtotal, coupon.value);
    }

    setBookingData((prev) => ({
      ...prev,
      couponCode: code,
      couponDetails: coupon,
      discount: calculatedDiscount
    }));

    return {
      success: true,
      message: `🎉 Offer "${code}" applied! You saved $${calculatedDiscount.toFixed(2)} (${coupon.desc}).`,
      discount: calculatedDiscount
    };
  };

  const removeCoupon = () => {
    setBookingData((prev) => ({
      ...prev,
      couponCode: '',
      couponDetails: null,
      discount: 0
    }));
  };

  // Helper to get complete financial calculation anytime
  const getCalculations = (customBooking = bookingData) => {
    const basePrice = parsePrice(customBooking.service?.numericPrice || customBooking.service?.price || 45);
    const addonsTotal = (customBooking.addons || []).reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    const serviceFee = customBooking.serviceFee !== undefined ? customBooking.serviceFee : 3.50;
    const subtotal = basePrice + addonsTotal + serviceFee;
    const discount = customBooking.discount || 0;
    const total = Math.max(0, subtotal - discount);
    const rewardPoints = Math.max(50, Math.round(total));

    return {
      basePrice,
      addonsTotal,
      serviceFee,
      subtotal,
      discount,
      total,
      rewardPoints
    };
  };

  const resetBooking = () => {
    setBookingData({
      service: null,
      technician: null,
      date: null,
      time: null,
      addons: [],
      serviceFee: 3.50,
      discount: 0,
      couponCode: '',
      couponDetails: null,
      paymentMethod: 'Pay in Studio',
      notes: ''
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBooking,
        toggleAddon,
        applyCoupon,
        removeCoupon,
        getCalculations,
        resetBooking,
        availableAddons: LUXURY_ADDONS,
        validCoupons: VALID_COUPONS
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};