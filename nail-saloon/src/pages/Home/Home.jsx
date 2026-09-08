// src/pages/Home/Home.jsx
import { useNavigate } from 'react-router-dom'; // 1. Import the hook

const Home = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  return (
    <div 
      className="min-h-[80vh] relative flex flex-col items-center justify-center p-4 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden bg-cover bg-center bg-no-repeat shadow-inner"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2070&auto=format&fit=crop')" 
      }}
    >
      <div className="absolute inset-0 bg-[#2B1E16]/10 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF8F5] mb-4 drop-shadow-md">
            Elevate Your Natural Beauty
          </h1>
          <p className="text-lg text-[#FAF8F5]/90 max-w-2xl mx-auto drop-shadow-sm font-medium">
            Welcome to NailMuse Studio. Choose your path below to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
          
          <div className="bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-2xl p-8 text-center flex flex-col h-full hover:bg-white/30 transition-all duration-300">
            <h2 className="text-2xl font-serif text-[#FAF8F5] mb-3">
              New Customer
            </h2>
            <p className="text-[#FAF8F5]/90 mb-8 grow">
              Join us and start your journey to elevated nail care.
            </p>
            {/* 3. Added onClick to navigate to /register */}
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-transparent text-[#FAF8F5] border-2 border-[#FAF8F5] px-5 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-[#FAF8F5] hover:text-[#2B1E16] transition-all"
            >
              Register Now
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-2xl p-8 text-center flex flex-col h-full hover:bg-white/30 transition-all duration-300">
            <h2 className="text-2xl font-serif text-[#FAF8F5] mb-3">
              Existing Customer
            </h2>
            <p className="text-[#FAF8F5]/90 mb-8 grow">
              Welcome back. Access your account to manage bookings.
            </p>
            {/* 4. Added onClick to navigate to /login */}
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-[#4A3B32] transition-all shadow-md border border-[#2B1E16]"
            >
              Log in &gt;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;