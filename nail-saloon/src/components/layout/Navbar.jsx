// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Simulated authentication check (Aap ise apne Auth context ke sath replace kar sakte hain)
  // For demo, let's assume user is logged in if they are on /account, /appointments, /rewards, etc.
  const isLoggedIn = ['/account', '/appointments', '/rewards', '/booking/technician'].includes(location.pathname) || localStorage.getItem('isLoggedIn') === 'true';

  const handleServicesClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('Please login first to view our services and book appointments.');
      navigate('/login');
    }
  };

  const handleAccountClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login');
    } else {
      navigate('/account');
    }
  };

  return (
    <nav className="w-full bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#F0EBE1] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-serif text-[#2B1E16]">
              NailMuse Studio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-sm font-medium transition-colors">Home</Link>
            
            {/* Services link checks login status */}
            <Link 
              to="/services" 
              onClick={handleServicesClick} 
              className="text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-sm font-medium transition-colors"
            >
              Services
            </Link>

            <Link to="/about" className="text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-sm font-medium transition-colors">About Us</Link>
            <Link to="/contact" className="text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-sm font-medium transition-colors">Contact</Link>
          </div>

          {/* Right Action: My Account / Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={handleAccountClick}
              className="bg-[#2B1E16] text-[#FAF8F5] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#4A3B32] transition-all shadow-md"
            >
              {isLoggedIn ? 'My Account' : 'Login / Register'}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#2B1E16] hover:text-[#4A3B32] focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5]/95 backdrop-blur-lg border-b border-[#F0EBE1] animate-fade-in">
          <div className="px-4 pt-3 pb-5 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-base font-medium rounded-lg hover:bg-white"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              onClick={(e) => { handleServicesClick(e); setIsMobileMenuOpen(false); }} 
              className="block text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-base font-medium rounded-lg hover:bg-white"
            >
              Services
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-base font-medium rounded-lg hover:bg-white"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[#4A3B32] hover:text-[#2B1E16] px-3 py-2 text-base font-medium rounded-lg hover:bg-white"
            >
              Contact
            </Link>
            <button 
              onClick={(e) => { handleAccountClick(e); setIsMobileMenuOpen(false); }}
              className="w-full mt-3 bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 rounded-xl text-base font-medium hover:bg-[#4A3B32] transition-all text-center shadow-md"
            >
              {isLoggedIn ? 'My Account' : 'Login / Register'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;