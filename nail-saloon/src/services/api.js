// src/services/api.js
import axios from 'axios';

// Read backend API base URL from Vite environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Automatically sends and receives HttpOnly cookies with every request
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication endpoints
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const getCurrentUser = () => API.get('/auth/me');
export const logoutUser = () => API.post('/auth/logout');

// Booking endpoints
export const createBooking = (bookingData) => API.post('/bookings/create', bookingData);
export const getUserBookings = (email) => API.get(`/bookings/user/${encodeURIComponent(email)}`);
export const getAllBookings = (params) => API.get('/bookings', { params });
export const getBookingStats = () => API.get('/bookings/stats');
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Services endpoints (for live catalog updates)
export const getServices = () => API.get('/services');
export const createService = (serviceData) => API.post('/services', serviceData);
export const updateService = (id, serviceData) => API.put(`/services/${id}`, serviceData);
export const deleteService = (id) => API.delete(`/services/${id}`);

// Salon Settings & Announcement endpoints (for live site-wide updates)
export const getSalonSettings = () => API.get('/settings');
export const updateSalonSettings = (settingsData) => API.put('/settings', settingsData);

// Client / User management endpoints
export const getAllUsers = () => API.get('/users');
export const updateUserLoyalty = (id, loyaltyData) => API.patch(`/users/${id}/loyalty`, loyaltyData);

// Live Queue endpoints (backed by the same /settings document)
export const getQueueStatus = () => API.get('/settings');
export const updateQueueStatus = (queueData) => API.put('/settings', queueData);

// Direct Email Offers & Campaigns endpoints
export const sendCustomerOffer = (offerData) => API.post('/offers/send', offerData);
export const getOfferCampaigns = () => API.get('/offers');
export const deleteOfferCampaign = (id) => API.delete(`/offers/${id}`);

export default API;