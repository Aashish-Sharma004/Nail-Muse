// src/pages/Booking/SelectTechnician.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const SelectTechnician = () => {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState('All');

  // 5 Expert Technicians with specific skills and categories
  const technicians = [
    { 
      id: 1, name: 'Elena M.', category: 'Nail Art', role: 'Master Nail Artist', 
      rating: 4.9, exp: '5 Years', reviews: 124, 
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      badge: '♥ Customer Favorite',
      skills: ['3D Art', 'Hand-painted', 'Gems']
    },
    { 
      id: 2, name: 'Mia K.', category: 'Extensions', role: 'Extension Specialist', 
      rating: 5.0, exp: '7 Years', reviews: 189, 
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      badge: '👑 Master Tech',
      skills: ['Gel-X', 'Acrylics', 'Sculpting']
    },
    { 
      id: 3, name: 'David L.', category: 'Essentials', role: 'Classic Manicure Expert', 
      rating: 4.7, exp: '6 Years', reviews: 76, 
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      badge: '',
      skills: ['Natural Nails', 'Cuticle Care', 'Men\'s Grooming']
    },
    { 
      id: 4, name: 'Sarah T.', category: 'Pedicure', role: 'Spa & Pedicure Expert', 
      rating: 4.8, exp: '4 Years', reviews: 92, 
      img: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?auto=format&fit=crop&w=300&q=80',
      badge: '✨ Fills up fast',
      skills: ['Reflexology', 'Callus Treatment', 'Relaxation']
    },
    { 
      id: 5, name: 'Jin S.', category: 'Nail Art', role: 'Trend Specialist', 
      rating: 4.9, exp: '3 Years', reviews: 54, 
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
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
        <h2 className="text-3xl md:text-4xl font-serif text-[#2B1E16] mb-3">
          Select Your Technician
        </h2>
        <p className="text-[#4A3B32] text-lg max-w-2xl">
          Choose one of our expert artists for your <span className="font-semibold">{bookingData.service?.title || 'upcoming appointment'}</span>. Each technician brings their unique style and specialized skills.
        </p>
      </div>

      {/* Interactive Category Filters */}
      <div className="flex overflow-x-auto gap-3 mb-10 pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
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
            className={`bg-white border ${bookingData.technician?.id === tech.id ? 'border-[#2B1E16] shadow-lg ring-1 ring-[#2B1E16]' : 'border-[#F0EBE1] hover:shadow-xl hover:-translate-y-1'} rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-5 transition-all duration-300 group`}
          >
            {/* Image & Badge Container */}
            <div className="relative w-full sm:w-40 h-56 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-[#F5EFE6]">
              <img 
                src={tech.img} 
                alt={tech.name} 
                onError={handleImageError}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
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
                  <h3 className="text-2xl font-serif text-[#2B1E16]">{tech.name}</h3>
                  <span className="bg-[#FAF8F5] px-2 py-1 rounded-md text-sm font-bold text-[#2B1E16] flex items-center gap-1 border border-[#F0EBE1]">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    {tech.rating}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-[#4A3B32] mb-3">{tech.role}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-[#4A3B32]/80 mb-4 pb-4 border-b border-[#F0EBE1]">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {tech.exp} Exp.
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
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
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  bookingData.technician?.id === tech.id 
                    ? 'bg-[#4A3B32] text-white shadow-md' 
                    : 'bg-[#2B1E16] text-[#FAF8F5] hover:bg-[#4A3B32] hover:shadow-md'
                }`}
              >
                Book {tech.name.split(' ')[0]} &rarr;
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