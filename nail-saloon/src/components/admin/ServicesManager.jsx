// src/components/admin/ServicesManager.jsx
import React, { useState } from 'react';

const ServicesManager = ({ services, onAddService, onUpdateService, onDeleteService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Essentials', 'Enhancements', 'Nail Art', 'Treatments'];

  const initialForm = {
    title: '',
    category: 'Essentials',
    price: '$50',
    duration: '45 mins',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
    description: '',
    isAvailable: true
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingService(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      category: service.category,
      price: service.price,
      duration: service.duration,
      image: service.image || initialForm.image,
      description: service.description || '',
      isAvailable: service.isAvailable !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill in service title and price');
      return;
    }

    if (editingService) {
      await onUpdateService(editingService._id || editingService.id, formData);
    } else {
      await onAddService(formData);
    }
    setIsModalOpen(false);
  };

  const toggleAvailability = (service) => {
    const updatedStatus = service.isAvailable === false ? true : false;
    onUpdateService(service._id || service.id, { ...service, isAvailable: updatedStatus });
  };

  const filtered = services.filter(s => categoryFilter === 'All' || s.category === categoryFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header with Add Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
        <div>
          <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold">Services & Catalog Management</h3>
          <p className="text-xs text-[#4A3B32] mt-0.5">
            Modify treatment offerings, update pricing, or add new luxury salon packages
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#2B1E16] text-[#FAF8F5] px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4A3B32] transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>+</span> Add New Service
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              categoryFilter === c
                ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-xs'
                : 'bg-white border border-[#F0EBE1] text-[#4A3B32] hover:border-[#2B1E16]'
            }`}
          >
            {c} ({c === 'All' ? services.length : services.filter(s => s.category === c).length})
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(service => {
          const isAvail = service.isAvailable !== false;

          return (
            <div 
              key={service._id || service.id}
              className={`bg-white border rounded-3xl overflow-hidden flex flex-col justify-between transition-all shadow-sm ${
                isAvail ? 'border-[#F0EBE1] hover:shadow-md' : 'border-rose-200 bg-rose-50/20 opacity-75'
              }`}
            >
              <div>
                {/* Image & Category Pill */}
                <div className="relative h-44 bg-[#F5EFE6] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/FAF8F5/2B1E16?text=NailMuse'; }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#2B1E16] uppercase tracking-wider">
                    {service.category}
                  </span>

                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isAvail ? 'Live on Site' : 'Hidden'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h4 className="font-serif font-semibold text-lg text-[#2B1E16] leading-snug">{service.title}</h4>
                    <span className="font-serif font-bold text-base text-[#2B1E16] shrink-0">{service.price}</span>
                  </div>
                  <p className="text-xs text-[#4A3B32] line-clamp-2 leading-relaxed mb-3">
                    {service.description || 'No description provided.'}
                  </p>
                  <p className="text-[11px] text-[#4A3B32]/80 font-medium">⏱ Duration: {service.duration}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-[#F0EBE1] flex items-center justify-between gap-2 bg-[#FAF8F5]/50">
                <button
                  onClick={() => toggleAvailability(service)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isAvail 
                      ? 'border-[#E0D8CB] text-[#4A3B32] hover:bg-[#EAE4D8]' 
                      : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isAvail ? 'Hide from Site' : 'Make Visible'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(service)}
                    className="text-xs bg-white border border-[#F0EBE1] text-[#2B1E16] px-3 py-1.5 rounded-lg font-semibold hover:border-[#2B1E16] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${service.title}" from salon catalog?`)) {
                        onDeleteService(service._id || service.id);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-[#4A3B32] hover:text-[#2B1E16] text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold mb-1">
              {editingService ? 'Edit Salon Service' : 'Add New Salon Service'}
            </h3>
            <p className="text-xs text-[#4A3B32] mb-6">
              Changes will update live across the public client booking catalog
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rose Quartz Luxury Manicure"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A3B32] font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
                  >
                    <option value="Essentials">Essentials</option>
                    <option value="Enhancements">Enhancements</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Treatments">Treatments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A3B32] font-semibold mb-1">Price (Display)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $65+ or $55"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A3B32] font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 mins"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A3B32] font-semibold mb-1">Status</label>
                  <select
                    value={formData.isAvailable ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
                  >
                    <option value="true">Live & Available</option>
                    <option value="false">Hidden from Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed treatment description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#F0EBE1] text-[#4A3B32] font-medium hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2B1E16] text-[#FAF8F5] font-semibold rounded-xl hover:bg-[#4A3B32] transition-colors shadow-sm cursor-pointer"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServicesManager;
