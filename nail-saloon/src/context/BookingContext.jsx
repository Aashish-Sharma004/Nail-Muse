// src/context/BookingContext.jsx
import { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

// Ye line add karne se warning hat jayegi
// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    service: { title: 'Signature Gel Manicure', price: 55, duration: '60 Min' }, // Default for testing
    technician: null,
    date: null,
    time: null,
    addons: [{ name: 'Nail Art Add-on (Minimal)', price: 15 }],
    discount: 14 // New Customer discount
  });

  const updateBooking = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const resetBooking = () => {
    setBookingData({ service: null, technician: null, date: null, time: null, addons: [], discount: 0 });
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};