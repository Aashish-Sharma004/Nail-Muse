// src/components/admin/AnnouncementEditor.jsx
import React, { useState, useEffect } from 'react';

const AnnouncementEditor = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState({
    bannerText: '✨ Spring Glam Special: 20% off all Gel-X & Nail Art sets with code GLAM20',
    bannerActive: true,
    promoCode: 'GLAM20',
    discountPercent: 20,
    salonHours: 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM',
    phoneContact: '+1 (555) 342-6873',
    salonAddress: '452 Beverly Blvd, Suite 200, Los Angeles, CA'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await onSaveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update salon settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Live Preview Box */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-serif text-lg text-[#2B1E16] font-semibold">Live Site Banner Preview</h4>
            <p className="text-xs text-[#4A3B32]">How this announcement appears to visitors on top of all pages</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            formData.bannerActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {formData.bannerActive ? '● Currently Active' : '○ Banner Inactive'}
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#F0EBE1] shadow-2xs">
          {formData.bannerActive ? (
            <div className="bg-gradient-to-r from-[#2B1E16] via-[#4A3B32] to-[#2B1E16] text-[#FAF8F5] px-4 py-2.5 text-center text-xs font-medium flex items-center justify-center gap-3">
              <span>💎</span>
              <span>{formData.bannerText}</span>
              {formData.promoCode && (
                <span className="bg-white/20 border border-white/30 text-white font-mono px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {formData.promoCode}
                </span>
              )}
            </div>
          ) : (
            <div className="bg-[#FAF8F5] text-[#4A3B32] p-4 text-center text-xs italic">
              Banner is currently disabled. Visitors will see the standard clean navigation header.
            </div>
          )}
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#F0EBE1]">
          <div>
            <h3 className="text-xl font-serif text-[#2B1E16] font-semibold">Web App Announcement & Studio Config</h3>
            <p className="text-xs text-[#4A3B32]">Update broadcast messaging, promo offers, and operational info</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-[#2B1E16] cursor-pointer">
              Enable Announcement Banner:
            </label>
            <input
              type="checkbox"
              checked={formData.bannerActive}
              onChange={(e) => setFormData({ ...formData, bannerActive: e.target.checked })}
              className="w-4 h-4 accent-[#2B1E16] cursor-pointer"
            />
          </div>
        </div>

        {/* Banner Text */}
        <div className="text-xs space-y-1.5">
          <label className="block font-semibold text-[#4A3B32]">Announcement Message Text</label>
          <input
            type="text"
            required
            value={formData.bannerText}
            onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
            placeholder="e.g. ✨ Flash Sale: 15% off all pedicures this Friday!"
            className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
          />
        </div>

        {/* Promo Code & Discount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1.5">Promotion Code</label>
            <input
              type="text"
              value={formData.promoCode}
              onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
              placeholder="e.g. GLAM20"
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] uppercase font-mono focus:outline-none focus:border-[#2B1E16]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1.5">Discount Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discountPercent}
              onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />
          </div>
        </div>

        {/* Salon Operating Hours & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1.5">Salon Studio Hours</label>
            <input
              type="text"
              value={formData.salonHours}
              onChange={(e) => setFormData({ ...formData, salonHours: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#4A3B32] mb-1.5">Public Contact Phone</label>
            <input
              type="text"
              value={formData.phoneContact}
              onChange={(e) => setFormData({ ...formData, phoneContact: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />
          </div>
        </div>

        {/* Studio Address */}
        <div className="text-xs space-y-1.5">
          <label className="block font-semibold text-[#4A3B32]">Studio Physical Address</label>
          <input
            type="text"
            value={formData.salonAddress}
            onChange={(e) => setFormData({ ...formData, salonAddress: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
          />
        </div>

        {/* Save Actions */}
        <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-700 animate-fade-in flex items-center gap-1">
                ✓ Web app settings published live!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#2B1E16] text-[#FAF8F5] px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#4A3B32] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Publishing...' : 'Publish to Web App ✨'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AnnouncementEditor;
