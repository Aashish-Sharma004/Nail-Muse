// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user: currentUser, isLoggedIn, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleServicesClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('Please login first to view our services and book appointments.');
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkBase =
    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg';
  const linkActive = 'text-[#2B1E16] bg-[#F5EFE6] font-semibold';
  const linkIdle   = 'text-[#4A3B32] hover:text-[#2B1E16] hover:bg-[#F5EFE6]';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services', onClick: handleServicesClick },
    ...(isLoggedIn && !isAdmin ? [{ to: '/booking/tracker', label: 'Live Queue', isLive: true }] : []),
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&family=Smooch+Sans:wght@100..900&display=swap');
        .nm-nav-brand { font-family: 'Libre Baskerville', serif; }
        .nm-nav-body  { font-family: 'Josefin Sans', sans-serif; }
      `}</style>

      <nav className="nm-nav-body w-full bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#F0EBE1] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Brand */}
            <Link to="/" className="nm-nav-brand text-xl md:text-2xl font-bold text-[#2B1E16] tracking-tight shrink-0">
              NailMuse Studio
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, onClick, isLive }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onClick}
                  className={`${linkBase} ${isActive(to) ? linkActive : linkIdle}`}
                >
                  {isLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1"></span>
                  )}
                  {label}
                </Link>
              ))}
              {isLoggedIn && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 ml-2 text-xs uppercase tracking-wider font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl hover:bg-amber-200 transition-colors"
                >
                  <Settings size={13} />
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate(isAdmin ? '/admin' : '/account')}
                    className="flex items-center gap-2 text-sm font-medium text-[#4A3B32] hover:text-[#2B1E16] px-3.5 py-2 rounded-lg hover:bg-[#F5EFE6] transition-all"
                  >
                    <User size={16} />
                    My Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-[#F5EFE6] text-[#2B1E16] border border-[#E8DCC8] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#EDE5D8] transition-all"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-[#2B1E16] text-[#FAF8F5] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4A3B32] transition-all shadow-md"
                >
                  <LogIn size={15} />
                  Login / Register
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#2B1E16] hover:text-[#4A3B32] p-2 rounded-lg hover:bg-[#F5EFE6] transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5]/98 backdrop-blur-lg border-b border-[#F0EBE1]">
            <div className="px-4 pt-3 pb-5 space-y-1">
              {navLinks.map(({ to, label, onClick, isLive }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={(e) => { if (onClick) onClick(e); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3 py-3 text-base font-medium rounded-xl transition-all ${
                    isActive(to) ? 'text-[#2B1E16] bg-[#F5EFE6]' : 'text-[#4A3B32] hover:text-[#2B1E16] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isLive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                    {label}
                  </span>
                  <ChevronRight size={16} className="opacity-40" />
                </Link>
              ))}

              {isLoggedIn && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-amber-950 font-bold px-3 py-3 text-base rounded-xl bg-amber-100 hover:bg-amber-200 transition-all"
                >
                  <Settings size={15} />
                  Admin Panel
                </Link>
              )}

              <div className="pt-3 border-t border-[#F0EBE1] space-y-2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { navigate(isAdmin ? '/admin' : '/account'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 text-[#4A3B32] px-3 py-3 text-base font-medium rounded-xl hover:bg-[#F5EFE6] transition-all"
                    >
                      <User size={17} />
                      My Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-[#F5EFE6] text-[#2B1E16] border border-[#E8DCC8] px-5 py-3 rounded-xl text-base font-medium hover:bg-[#EDE5D8] transition-all"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 rounded-xl text-base font-semibold hover:bg-[#4A3B32] transition-all shadow-md"
                  >
                    <LogIn size={16} />
                    Login / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;