// src/pages/About/About.jsx
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in text-[#2B1E16]">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest bg-[#F5EFE6] px-3 py-1.5 rounded-full font-bold mb-3 inline-block">
          Our Story
        </span>
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Welcome to NailMuse Studio</h1>
        <p className="text-[#4A3B32] text-lg max-w-2xl mx-auto">
          Where luxury meets artistry. We believe that self-care is an essential ritual, not a luxury.
        </p>
      </div>

      {/* Image Grid / Features */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div className="rounded-3xl overflow-hidden shadow-lg h-80 bg-[#F5EFE6]">
          <img 
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80" 
            alt="Salon Interior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-serif">Crafted for Elegance</h2>
          <p className="text-[#4A3B32] leading-relaxed">
            Founded with a passion for immaculate nail care and modern design, NailMuse Studio provides a serene sanctuary away from the hustle and bustle of daily life. 
          </p>
          <p className="text-[#4A3B32] leading-relaxed">
            Our master technicians use premium, non-toxic products and cutting-edge techniques to ensure your nails remain healthy, strong, and stunningly beautiful.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-8 md:p-12 shadow-sm mb-12 text-center">
        <h3 className="text-2xl font-serif mb-8">The NailMuse Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
            <span className="text-2xl mb-2 block">✨</span>
            <h4 className="font-semibold mb-1">Expert Artists</h4>
            <p className="text-sm text-[#4A3B32]">Certified professionals specialized in 3D art, Gel-X, and precision care.</p>
          </div>
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
            <span className="text-2xl mb-2 block">🌿</span>
            <h4 className="font-semibold mb-1">Clean & Safe</h4>
            <p className="text-sm text-[#4A3B32]">Hospital-grade sterilization and premium eco-friendly products.</p>
          </div>
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
            <span className="text-2xl mb-2 block">🕒</span>
            <h4 className="font-semibold mb-1">Real-Time Queue</h4>
            <p className="text-sm text-[#4A3B32]">Track your appointment wait times live without sitting idle in the salon.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={() => navigate('/services')}
          className="bg-[#2B1E16] text-[#FAF8F5] px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#4A3B32] transition-all shadow-lg"
        >
          Explore Our Services &rarr;
        </button>
      </div>

    </div>
  );
};

export default About;