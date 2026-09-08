// src/pages/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    dob: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend API call for registration
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      // Save token and user details in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isLoggedIn', 'true');

      // Directs the user to the account dashboard after registering
      navigate('/account'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-linear-to-br from-[#FAF8F5] via-[#F5EFE6] to-[#E8DCC8] p-4 md:p-6 rounded-2xl md:rounded-3xl">
      <div className="w-[95%] sm:w-full max-w-md md:max-w-xl bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_32px_0_rgba(43,30,22,0.05)] rounded-2xl p-6 md:p-10 text-center">
        
        <h1 className="text-3xl md:text-4xl font-serif text-[#2B1E16] mb-2">
          Create Account
        </h1>
        <p className="text-sm md:text-base text-[#4A3B32] mb-6">
          Please fill in your details to get started.
        </p>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-left">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#4A3B32] mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe" 
                className="w-full bg-white/50 border border-[#F0EBE1] text-[#2B1E16] placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-lg px-4 py-2.5 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3B32] mb-1">
                Profile Photo
              </label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full bg-white/50 border border-[#F0EBE1] text-[#4A3B32]/70 text-sm focus:outline-none focus:border-[#2B1E16] rounded-lg px-2 py-2 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2B1E16] file:text-[#FAF8F5] hover:file:bg-[#4A3B32]"
              />
              <p className="text-[10px] text-[#4A3B32]/70 mt-1">Optional, but nice to have.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3B32] mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com" 
                className="w-full bg-white/50 border border-[#F0EBE1] text-[#2B1E16] placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-lg px-4 py-2.5 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3B32] mb-1">
                Phone Number
              </label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567" 
                className="w-full bg-white/50 border border-[#F0EBE1] text-[#2B1E16] placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-lg px-4 py-2.5 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3B32] mb-1">
                Create Password
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/50 border border-[#F0EBE1] text-[#2B1E16] placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-lg px-4 py-2.5 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3B32] mb-1">
                Date of Birth
              </label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-white/50 border border-[#F0EBE1] text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-lg px-4 py-2.5 transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 mt-4 rounded-lg text-sm md:text-base font-medium hover:bg-[#4A3B32] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        {/* Join the Club Section */}
        <div className="mt-8 pt-6 border-t border-[#F0EBE1] flex flex-col space-y-3 text-sm text-[#4A3B32]">
          <h3 className="font-serif text-lg text-[#2B1E16]">Join the Club</h3>
          <p className="text-xs md:text-sm px-4">
            Create an account to book appointments, save your favorite nail art, and earn loyalty points.
          </p>
          <p className="pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2B1E16] hover:text-[#4A3B32] transition-colors underline decoration-[#2B1E16]/30 underline-offset-2">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;