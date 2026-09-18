// src/components/admin/TechniciansManager.jsx
import React, { useState } from 'react';
import { 
  UserPlus, Edit3, Trash2, Star, CheckCircle, XCircle, 
  Search, Sparkles, Award, Clock, Briefcase, Eye, ShieldCheck
} from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Elena (Nail Art)', url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mia (Extensions)', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80' },
  { label: 'David (Essentials)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sarah (Pedicure)', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80' },
  { label: 'Jin (Trending)', url: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chloe (Luxe Artist)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Aria (Japanese Art)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' }
];

const BADGE_PRESETS = [
  '♥ Customer Favorite',
  '👑 Master Tech',
  '🔥 Trending',
  '✨ Fills up fast',
  '⭐ Top Rated',
  '💅 Nail Art Lead'
];

const CATEGORIES = ['All', 'Essentials', 'Nail Art', 'Extensions', 'Pedicure'];

const TechniciansManager = ({ 
  technicians = [], 
  onAddTechnician, 
  onUpdateTechnician, 
  onDeleteTechnician, 
  onToggleAvailability 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const initialForm = {
    name: '',
    role: 'Master Nail Artist',
    category: 'Nail Art',
    rating: 4.9,
    reviews: 50,
    exp: '4 Years',
    img: PRESET_AVATARS[0].url,
    badge: '♥ Customer Favorite',
    skills: '3D Art, Hand-painted, Gems',
    available: true
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingTech(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (tech) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name || '',
      role: tech.role || 'Master Nail Artist',
      category: tech.category || 'Nail Art',
      rating: tech.rating ?? 4.9,
      reviews: tech.reviews ?? 50,
      exp: tech.exp || '3+ Years',
      img: tech.img || PRESET_AVATARS[0].url,
      badge: tech.badge || '',
      skills: Array.isArray(tech.skills) ? tech.skills.join(', ') : (tech.skills || ''),
      available: tech.available !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter technician full name');
      return;
    }

    const payload = {
      ...formData,
      rating: Number(formData.rating) || 5.0,
      reviews: Number(formData.reviews) || 0,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingTech) {
      await onUpdateTechnician(editingTech._id || editingTech.id, payload);
    } else {
      await onAddTechnician(payload);
    }
    setIsModalOpen(false);
  };

  // Filtered technicians
  const filteredTechs = technicians.filter(tech => {
    const matchesCategory = categoryFilter === 'All' || tech.category === categoryFilter;
    const matchesSearch = tech.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Top Banner & Actions Header */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-[#4A3B32] font-semibold">Artist Management</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Live Roster
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#2B1E16] font-bold">Salon Nail Artists & Technicians</h2>
          <p className="text-xs md:text-sm text-[#4A3B32]">
            Add new artists, update their specialty skills, manage customer ratings, and toggle on-duty booking availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#2B1E16] text-[#FAF8F5] text-xs font-semibold px-5 py-3 rounded-2xl hover:bg-[#4A3B32] transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus size={16} />
          <span>Add New Artist</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A3B32]/50" />
          <input
            type="text"
            placeholder="Search by artist name, role, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#F0EBE1] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2B1E16] placeholder:text-[#4A3B32]/50 focus:outline-none focus:border-[#2B1E16]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-[#2B1E16] text-[#FAF8F5] font-semibold shadow-xs' 
                  : 'bg-white border border-[#F0EBE1] text-[#4A3B32] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Technicians Grid */}
      {filteredTechs.length === 0 ? (
        <div className="bg-white border border-[#F0EBE1] rounded-3xl p-12 text-center text-[#4A3B32] space-y-3">
          <p className="font-serif text-lg text-[#2B1E16]">No nail artists match your search or filter</p>
          <p className="text-xs">Try clearing your filters or click "Add New Artist" to expand your salon roster.</p>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
            className="text-xs underline text-[#2B1E16] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechs.map((tech) => {
            const isAvailable = tech.available !== false;
            return (
              <div 
                key={tech._id || tech.id}
                className={`bg-white border ${isAvailable ? 'border-[#F0EBE1]' : 'border-rose-200 bg-rose-50/20'} rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group`}
              >
                {/* Status & Badge Top Row */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    {/* Badge */}
                    {tech.badge ? (
                      <span className="bg-[#2B1E16] text-[#FAF8F5] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                        {tech.badge}
                      </span>
                    ) : (
                      <span className="bg-[#FAF8F5] text-[#4A3B32] border border-[#F0EBE1] text-[10px] font-medium px-2.5 py-1 rounded-full">
                        {tech.category}
                      </span>
                    )}

                    {/* Duty Availability Toggle Button */}
                    <button
                      onClick={() => onToggleAvailability(tech._id || tech.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAvailable 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                      title={isAvailable ? 'Click to set Off Duty' : 'Click to set On Duty'}
                    >
                      <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                      <span>{isAvailable ? 'On Duty' : 'Off Duty'}</span>
                    </button>
                  </div>

                  {/* Profile Info Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={tech.img || PRESET_AVATARS[0].url} 
                      alt={tech.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-base text-[#2B1E16] truncate">{tech.name}</h3>
                      <p className="text-xs text-[#4A3B32] truncate">{tech.role}</p>
                      
                      <div className="flex items-center gap-2 text-[11px] text-[#4A3B32] mt-1">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star size={12} className="fill-amber-500 text-amber-500" />
                          {tech.rating?.toFixed(1) || '5.0'}
                        </span>
                        <span>•</span>
                        <span>{tech.reviews || 0} reviews</span>
                        <span>•</span>
                        <span className="font-medium text-[#2B1E16]">{tech.exp || '3+ Yrs'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category & Skills */}
                  <div className="space-y-2 mb-5">
                    <div className="text-[11px] text-[#4A3B32] flex items-center gap-1.5">
                      <span className="font-semibold text-[#2B1E16]">Specialty:</span>
                      <span className="bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#F0EBE1]">{tech.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(tech.skills || []).map((skill, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-medium bg-[#F5EFE6]/70 text-[#2B1E16] border border-[#E8DCC8] px-2 py-0.5 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
                  <div className="text-[10px] text-[#4A3B32]/70">
                    ID: {(tech._id || tech.id || '').toString().slice(-6)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(tech)}
                      className="text-xs text-[#2B1E16] bg-[#FAF8F5] hover:bg-[#F0EBE1] border border-[#E8DCC8] px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove artist "${tech.name}" from the salon roster?`)) {
                          onDeleteTechnician(tech._id || tech.id);
                        }
                      }}
                      className="text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Technician Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#F0EBE1] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
              <div>
                <h3 className="text-xl font-serif text-[#2B1E16] font-bold">
                  {editingTech ? 'Edit Artist Profile' : 'Add New Nail Artist'}
                </h3>
                <p className="text-xs text-[#4A3B32]">
                  {editingTech ? 'Update technician profile, skills, and status' : 'Register a new nail technician for client bookings'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#4A3B32] hover:text-[#2B1E16] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena M."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Title / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Nail Artist"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>
              </div>

              {/* Specialty Category & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Specialty Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  >
                    <option value="Nail Art">Nail Art</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Extensions">Extensions</option>
                    <option value="Pedicure">Pedicure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Years"
                    value={formData.exp}
                    onChange={(e) => setFormData({ ...formData, exp: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>
              </div>

              {/* Special Badge */}
              <div>
                <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Special Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ♥ Customer Favorite"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {BADGE_PRESETS.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setFormData({ ...formData, badge: b })}
                      className="text-[10px] bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E8DCC8] px-2 py-0.5 rounded-md text-[#4A3B32] transition-colors cursor-pointer"
                    >
                      {b}
                    </button>
                  ))}
                  {formData.badge && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, badge: '' })}
                      className="text-[10px] text-rose-600 hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Image URL & Avatar Presets */}
              <div>
                <label className="block text-xs font-semibold text-[#2B1E16] mb-1">Profile Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />

                {/* Preset Avatars Quick Click */}
                <div className="mt-2">
                  <span className="text-[10px] text-[#4A3B32] block mb-1">Or choose a preset artist portrait:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((av, idx) => (
                      <img
                        key={idx}
                        src={av.url}
                        alt={av.label}
                        title={av.label}
                        onClick={() => setFormData({ ...formData, img: av.url })}
                        className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                          formData.img === av.url ? 'border-[#2B1E16] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills (Comma Separated) */}
              <div>
                <label className="block text-xs font-semibold text-[#2B1E16] mb-1">
                  Skills & Techniques (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3D Art, Hand-painted, Gems, Gel-X"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl px-3 py-2 text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              {/* Duty Availability Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1]">
                <div>
                  <p className="text-xs font-semibold text-[#2B1E16]">Currently On Duty / Available</p>
                  <p className="text-[10px] text-[#4A3B32]">Customers can pick this artist during booking</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 accent-[#2B1E16] cursor-pointer"
                />
              </div>

              {/* Submit / Cancel */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#4A3B32] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#2B1E16] text-[#FAF8F5] text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4A3B32] transition-colors shadow-md cursor-pointer"
                >
                  {editingTech ? 'Save Changes' : 'Create Artist'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TechniciansManager;
