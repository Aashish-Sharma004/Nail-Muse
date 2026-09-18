import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../../services/api';
import { useBooking } from '../../context/BookingContext';
import { Search, Clock, ArrowRight } from 'lucide-react';

// Fallback initial services if backend is initializing
const fallbackServiceData = [
  {
    id: 1, category: 'Essentials', title: 'Signature Manicure', price: '$45+', duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    description: 'A meticulous detailing of nails and cuticles, followed by a hydrating hand massage and finished with a flawless polish application.'
  },
  {
    id: 2, category: 'Essentials', title: 'Signature Spa Pedicure', price: '$65+', duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    description: 'Relax with a soothing foot soak, complete callus treatment, exfoliating scrub, extended lower leg massage, and perfect polish.'
  },
  {
    id: 3, category: 'Essentials', title: 'Gel Polish Manicure', price: '$55+', duration: '50 mins',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    description: 'Enjoy long-lasting, chip-resistant color for up to two weeks. Includes full cuticle care and precise gel application.'
  },
  {
    id: 4, category: 'Enhancements', title: 'Gel-X Extensions', price: '$85+', duration: '90 mins',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    description: 'Flawless, lightweight extensions using Apres Gel-X. Causes zero damage to natural nails while providing perfect shape and length.'
  },
  {
    id: 5, category: 'Enhancements', title: 'Acrylic Full Set', price: '$75+', duration: '90 mins',
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80',
    description: 'Classic acrylic enhancements sculpted to perfection. Includes your choice of shape, length, and a standard gel polish finish.'
  },
  {
    id: 6, category: 'Enhancements', title: 'Dip Powder (SNS)', price: '$60+', duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'A durable, odor-free alternative to acrylics infused with vitamins to strengthen your natural nails.'
  },
  {
    id: 7, category: 'Nail Art', title: 'Minimalist Nail Art', price: '$15+', duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
    description: 'Subtle and chic. Add French tips, negative space designs, dots, or delicate lines to any base service.'
  },
  {
    id: 8, category: 'Nail Art', title: 'Custom 3D / Gem Art', price: '$35+', duration: '30 mins',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    description: 'Elevate your set with intricate 3D sculpting, Swarovski crystals, chrome powders, or hand-painted murals.'
  },
  {
    id: 9, category: 'Treatments', title: 'IBX Strengthening', price: '$20', duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    description: 'A penetrating toughening agent that fuses together the nails top layers to improve nail plate integrity.'
  },
  {
    id: 10, category: 'Treatments', title: 'Paraffin Wax Wrap', price: '$15', duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    description: 'Intense moisture therapy for hands or feet. Relieves joint stiffness while leaving skin silky smooth.'
  },
  {
    id: 11, category: 'Essentials', title: 'Express Polish Change', price: '$25', duration: '20 mins',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    description: 'In a rush? Quick removal of old standard polish, light shaping, and a fresh coat of lacquer.'
  },
  {
    id: 12, category: 'Essentials', title: "Men's Executive Grooming", price: '$40', duration: '35 mins',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    description: 'Detailed cuticle care, precise shaping, buffing to a natural shine, and a tension-relief hand massage.'
  }
];

const categories = ['All', 'Essentials', 'Enhancements', 'Nail Art', 'Treatments'];

const ServiceList = () => {
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const [services, setServices] = useState(fallbackServiceData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getServices()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch(err => {
        console.warn('Using fallback services:', err);
      });
  }, []);

  const filteredServices = services.filter(service => {
    // Only show available services if isAvailable is defined
    if (service.isAvailable === false) return false;

    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    const matchesSearch = (service.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (service.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fallback function: if an image ever fails, replace with verified working nail photo
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent looping
    e.target.src = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2B1E16] mb-3 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.2' }}>
          Our Services
        </h1>
        <p className="text-[#4A3B32] text-base md:text-lg max-w-2xl leading-relaxed">
          Curated nail care and artistry designed to elevate your everyday. Discover your perfect treatment below.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
        <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2.5 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-md'
                  : 'bg-white border border-[#F0EBE1] text-[#4A3B32] hover:border-[#2B1E16]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-[#4A3B32]/60" />
          </div>
          <input
            type="text"
            placeholder="Search treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F0EBE1] text-sm text-[#2B1E16] placeholder:text-[#4A3B32]/60 rounded-full focus:outline-none focus:border-[#2B1E16] focus:ring-1 focus:ring-[#2B1E16] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div 
              key={service._id || service.id} 
              className="bg-white border border-[#F0EBE1] rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-[#F5EFE6]">
                <img 
                  src={service.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'} 
                  alt={service.title}
                  onError={handleImageError} // Automatically fixes broken images
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3.5 left-3.5 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-[#2B1E16] shadow-sm">
                  {service.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start mb-2.5 gap-4">
                  <h3 className="text-xl font-serif text-[#2B1E16] leading-snug" style={{ fontFamily: "'Libre Baskerville', serif", lineHeight: '1.3' }}>{service.title}</h3>
                  <span className="text-lg font-bold text-[#d4956b] shrink-0">{service.price}</span>
                </div>
                
                <p className="text-sm text-[#4A3B32] mb-5 grow" style={{ lineHeight: '1.75' }}>
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F0EBE1]">
                  <div className="flex items-center gap-1.5 text-sm text-[#4A3B32] font-medium">
                    <Clock size={15} className="text-[#4A3B32]/70" />
                    {service.duration}
                  </div>
                  <button 
                    onClick={() => {
                      updateBooking({ service });
                      navigate('/booking/technician');
                    }}
                    className="flex items-center gap-1.5 bg-[#2B1E16] text-[#FAF8F5] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4A3B32] transition-colors shadow-sm cursor-pointer"
                  >
                    Book Now <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <p className="text-xl font-serif text-[#2B1E16] mb-2">No treatments found</p>
            <p className="text-[#4A3B32]">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ServiceList;