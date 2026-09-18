// src/pages/Booking/SelectTechnician.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Star, Briefcase, MessageCircle, ArrowRight } from 'lucide-react';

const SelectTechnician = () => {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState('All');

  // 5 Expert Technicians with specific skills and categories
  const technicians = [
    { 
      id: 1, name: 'Elena M.', category: 'Nail Art', role: 'Master Nail Artist', 
      rating: 4.9, exp: '5 Years', reviews: 124, 
      img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80',
      badge: '♥ Customer Favorite',
      skills: ['3D Art', 'Hand-painted', 'Gems']
    },
    { 
      id: 2, name: 'Mia K.', category: 'Extensions', role: 'Extension Specialist', 
      rating: 5.0, exp: '7 Years', reviews: 189, 
      img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80',
      badge: '👑 Master Tech',
      skills: ['Gel-X', 'Acrylics', 'Sculpting']
    },
    { 
      id: 3, name: 'David L.', category: 'Essentials', role: 'Classic Manicure Expert', 
      rating: 4.7, exp: '6 Years', reviews: 76, 
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      badge: '',
      skills: ['Natural Nails', 'Cuticle Care', "Men's Grooming"]
    },
    { 
      id: 4, name: 'Sarah T.', category: 'Pedicure', role: 'Spa & Pedicure Expert', 
      rating: 4.8, exp: '4 Years', reviews: 92, 
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
      badge: '✨ Fills up fast',
      skills: ['Reflexology', 'Callus Treatment', 'Relaxation']
    },
    { 
      id: 5, name: 'Jin S.', category: 'Nail Art', role: 'Trend Specialist', 
      rating: 4.9, exp: '3 Years', reviews: 54, 
      img: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=300&q=80',
      badge: '🔥 Trending',
      skills: ['Chrome', 'Aura Nails', 'Korean Style']
    }
  ];

  const categories = ['All', 'Essentials', 'Nail Art', 'Extensions', 'Pedicure'];

  // Filter functionality
  const filteredTechs = technicians.filter(tech => 
    activeCategory === 'All' ? true : tech.category === activeCategory
  );

  const handleSelect = (tech) => {
    // Save the full technician object so we can show their image on the review page
    updateBooking({ technician: tech });
    navigate('/booking/date-time');
  };

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/300x400/FAF8F5/2B1E16?text=NailMuse`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
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
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTechs.map((tech) => (
          <div 
            key={tech.id} 
            className={`bg-white border ${bookingData.technician?.id === tech.id ? 'border-[#2B1E16] shadow-lg ring-1 ring-[#2B1E16]' : 'border-[#F0EBE1] hover:shadow-xl hover:-translate-y-1'} rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-5 transition-all duration-300 group`}
          >
            {/* Image & Badge Container */}
            <div className="relative w-full sm:w-40 h-56 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-[#F5EFE6]">
              <img 
                src={tech.img} 
                alt={tech.name} 
                onError={handleImageError}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
              />
              {tech.badge && (
                <div className="absolute top-2 left-2 bg-[#FAF8F5]/90 backdrop-blur-sm text-[#2B1E16] font-bold text-[10px] px-2.5 py-1.5 rounded-md shadow-sm uppercase tracking-wider">
                  {tech.badge}
                </div>
              )}
            </div>
            
            {/* Technician Info Container */}
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl md:text-2xl text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.2' }}>{tech.name}</h3>
                  <span className="bg-[#FAF8F5] px-2 py-1 rounded-md text-sm font-bold text-[#2B1E16] flex items-center gap-1 border border-[#F0EBE1]">
                    <Star size={14} color="#d4956b" fill="#d4956b" />
                    {tech.rating}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-[#4A3B32] mb-3">{tech.role}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-[#4A3B32]/80 mb-4 pb-4 border-b border-[#F0EBE1]">
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-[#4A3B32]/60" />
                    {tech.exp} Exp.
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-[#4A3B32]/60" />
                    {tech.reviews} Reviews
                  </span>
                </div>

                {/* Specialties / Skills Tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {tech.skills.map((skill, index) => (
                    <span key={index} className="bg-[#FAF8F5] text-[#4A3B32] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#F0EBE1]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleSelect(tech)}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 ${
                  bookingData.technician?.id === tech.id 
                    ? 'bg-[#4A3B32] text-white shadow-md' 
                    : 'bg-[#2B1E16] text-[#FAF8F5] hover:bg-[#4A3B32] hover:shadow-md'
                }`}
              >
                Book {tech.name.split(' ')[0]} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTechs.length === 0 && (
        <div className="text-center py-12 text-[#4A3B32]">
          No technicians available for this category.
        </div>
      )}
    </div>
  );
};

export default SelectTechnician;