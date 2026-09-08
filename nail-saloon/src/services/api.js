// src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const createBooking = (bookingData) => API.post('/bookings/create', bookingData);
export const getUserBookings = (email) => API.get(`/bookings/user/${email}`);