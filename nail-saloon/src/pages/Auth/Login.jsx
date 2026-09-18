// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend login request via environment-configured API service
      const response = await loginUser({
        email: formData.emailOrPhone,
        password: formData.password
      });

      const loggedUser = response.data.user;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('isLoggedIn', 'true');

      // Navigate based on role: Admin to /admin, clients to /account
      if (loggedUser?.role === 'admin' || loggedUser?.email === 'admin123@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-linear-to-br from-[#FAF8F5] via-[#F5EFE6] to-[#E8DCC8] p-4 md:p-6 rounded-2xl md:rounded-3xl">
      <div className="w-[95%] sm:w-full max-w-md md:max-w-lg bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_32px_0_rgba(43,30,22,0.05)] rounded-2xl p-6 md:p-10 text-center">
        
        <h1 className="text-2xl md:text-3xl font-serif text-[#2B1E16] mb-2 leading-tight">
          Welcome back to your sanctuary.
        </h1>
        <h2 className="text-base md:text-lg text-[#4A3B32] font-medium mb-6">
          Login
        </h2>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-left animate-shake">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">
              Email Address
            </label>
            <input 
              type="email" 
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="sarah@example.com" 
              className="w-full bg-white/60 border border-[#F0EBE1] text-[#2B1E16] text-sm placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-xl px-4 py-2.5 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="w-full bg-white/60 border border-[#F0EBE1] text-[#2B1E16] text-sm placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] rounded-xl px-4 py-2.5 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 mt-3 rounded-xl text-sm md:text-base font-semibold hover:bg-[#4A3B32] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Login →'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 flex flex-col space-y-2.5 text-sm text-[#4A3B32]">
          <Link to="/forgot-password" className="hover:text-[#2B1E16] transition-colors underline decoration-[#4A3B32]/30 underline-offset-2">
            Forgot Password?
          </Link>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#2B1E16] hover:text-[#4A3B32] transition-colors underline decoration-[#2B1E16]/30 underline-offset-2">
              Register Here
            </Link>
          </p>
          <Link to="/" className="hover:text-[#2B1E16] transition-colors pt-1">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;