// src/pages/Booking/SelectTechnician.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { getTechnicians } from '../../services/api';
import { Star, Briefcase, MessageCircle, ArrowRight } from 'lucide-react';

const FALLBACK_TECHNICIANS = [
  { 
    _id: '1', id: 1, name: 'Elena M.', category: 'Nail Art', role: 'Master Nail Artist', 
    rating: 4.9, exp: '5 Years', reviews: 124, 
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
    badge: '♥ Customer Favorite',
    skills: ['3D Art', 'Hand-painted', 'Gems'],
    available: true
  },
  { 
    _id: '2', id: 2, name: 'Mia K.', category: 'Extensions', role: 'Extension Specialist', 
    rating: 5.0, exp: '7 Years', reviews: 189, 
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    badge: '👑 Master Tech',
    skills: ['Gel-X', 'Acrylics', 'Sculpting'],
    available: true
  },
  { 
    _id: '3', id: 3, name: 'David L.', category: 'Essentials', role: 'Classic Manicure Expert', 
    rating: 4.7, exp: '6 Years', reviews: 76, 
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    badge: '',
    skills: ['Natural Nails', 'Cuticle Care', "Men's Grooming"],
    available: true
  },
  { 
    _id: '4', id: 4, name: 'Sarah T.', category: 'Pedicure', role: 'Spa & Pedicure Expert', 
    rating: 4.8, exp: '4 Years', reviews: 92, 
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    badge: '✨ Fills up fast',
    skills: ['Reflexology', 'Callus Treatment', 'Relaxation'],
    available: true
  },
  { 
    _id: '5', id: 5, name: 'Jin S.', category: 'Nail Art', role: 'Trend Specialist', 
    rating: 4.9, exp: '3 Years', reviews: 54, 
    img: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=600&q=80',
    badge: '🔥 Trending',
    skills: ['Chrome', 'Aura Nails', 'Korean Style'],
    available: true
  }
];

const categories = ['All', 'Essentials', 'Nail Art', 'Extensions', 'Pedicure'];

const SelectTechnician = () => {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  const [technicians, setTechnicians] = useState(FALLBACK_TECHNICIANS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch real-time technician roster from backend database
  useEffect(() => {
    getTechnicians()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTechnicians(res.data);
        }
      })
      .catch(err => {
        console.warn('Backend technicians fetch fallback:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter functionality
  const filteredTechs = technicians.filter(tech => 
    activeCategory === 'All' ? true : tech.category === activeCategory
  );

  const handleSelect = (tech) => {
    // Normalize technician object
    const normalizedTech = {
      ...tech,
      id: tech._id || tech.id,
      name: tech.name
    };
    updateBooking({ technician: normalizedTech });
    navigate('/booking/date-time');
  };

  const handleImageError = (e) => {
    e.target.src = `https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80`;
  };

  const selectedTechId = bookingData.technician?._id || bookingData.technician?.id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
          <span className="text-xs uppercase tracking-widest text-[#4A3B32] font-semibold">Step 1 of 5</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2B1E16]"></span>
          <span className="text-xs text-[#4A3B32]">Select Specialist</span>
        </div>

        <h2 className="text-3xl md:text-4xl text-[#2B1E16] mb-3" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, lineHeight: '1.2' }}>
          Select Your Technician
        </h2>
        <p className="text-[#4A3B32] text-base md:text-lg max-w-2xl leading-relaxed">
          Choose one of our expert artists for your <span className="font-semibold text-[#2B1E16]">{bookingData.service?.title || 'upcoming appointment'}</span>. Each technician brings their unique style and specialized skills.
        </p>
      </div>

      {/* Interactive Category Filters */}
      <div className="flex overflow-x-auto gap-3 mb-10 pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeCategory === cat 
                ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-md' 
                : 'bg-white border border-[#F0EBE1] text-[#4A3B32] hover:border-[#2B1E16]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Technicians Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2B1E16] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif text-[#2B1E16]">Loading our salon artists...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTechs.map((tech) => {
            const techId = tech._id || tech.id;
            const isSelected = selectedTechId === techId;
            const isAvailable = tech.available !== false;

            return (
              <div 
                key={techId} 
                className={`bg-white border ${
                  isSelected 
                    ? 'border-[#2B1E16] shadow-lg ring-1 ring-[#2B1E16]' 
                    : !isAvailable 
                    ? 'border-[#F0EBE1] opacity-75' 
                    : 'border-[#F0EBE1] hover:shadow-xl hover:-translate-y-1'
                } rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-5 transition-all duration-300 group`}
              >
                {/* Image & Badge Container */}
                <div className="relative w-full sm:w-40 h-56 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-[#F5EFE6]">
                  <img 
                    src={tech.img || FALLBACK_TECHNICIANS[0].img} 
                    alt={tech.name} 
                    onError={handleImageError}
                    className={`w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ${!isAvailable ? 'grayscale' : ''}`} 
                  />
                  {tech.badge && (
                    <div className="absolute top-2 left-2 bg-[#FAF8F5]/90 backdrop-blur-sm text-[#2B1E16] font-bold text-[10px] px-2.5 py-1.5 rounded-md shadow-sm uppercase tracking-wider">
                      {tech.badge}
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center">
                      <span className="bg-white/90 text-[#2B1E16] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Off Duty
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Technician Info Container */}
                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl md:text-2xl text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.2' }}>
                        {tech.name}
                      </h3>
                      <span className="bg-[#FAF8F5] px-2 py-1 rounded-md text-sm font-bold text-[#2B1E16] flex items-center gap-1 border border-[#F0EBE1]">
                        <Star size={14} color="#d4956b" fill="#d4956b" />
                        {tech.rating ? Number(tech.rating).toFixed(1) : '5.0'}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-[#4A3B32] mb-3">{tech.role}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#4A3B32]/80 mb-4 pb-4 border-b border-[#F0EBE1]">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-[#4A3B32]/60" />
                        {tech.exp || '3+ Yrs'} Exp.
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle size={14} className="text-[#4A3B32]/60" />
                        {tech.reviews || 0} Reviews
                      </span>
                    </div>

                    {/* Specialties / Skills Tags */}
                    <div className="mb-5 flex flex-wrap gap-2">
                      {(tech.skills || []).map((skill, index) => (
                        <span key={index} className="bg-[#FAF8F5] text-[#4A3B32] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#F0EBE1]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {isAvailable ? (
                    <button 
                      onClick={() => handleSelect(tech)}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#4A3B32] text-white shadow-md' 
                          : 'bg-[#2B1E16] text-[#FAF8F5] hover:bg-[#4A3B32] hover:shadow-md'
                      }`}
                    >
                      {isSelected ? `Selected ✓` : `Book ${tech.name.split(' ')[0]}`} <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full py-3 rounded-xl text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed text-center"
                    >
                      Currently Off Duty
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!loading && filteredTechs.length === 0 && (
        <div className="text-center py-12 text-[#4A3B32]">
          No technicians available for this category.
        </div>
      )}
    </div>
  );
};

export default SelectTechnician;