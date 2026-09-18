// src/components/layout/AnnouncementBanner.jsx
import React, { useState, useEffect } from 'react';
import { getSalonSettings } from '../../services/api';
import { Gem, X } from 'lucide-react';

const AnnouncementBanner = () => {
  const [settings, setSettings] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getSalonSettings()
      .then(res => {
        if (res?.data) {
          setSettings(res.data);
        }
      })
      .catch(() => {
        // Fallback default if backend is unavailable
        setSettings({
          bannerText: 'Spring Glam Special: 20% off all Gel-X & Nail Art sets with code GLAM20',
          bannerActive: true,
          promoCode: 'GLAM20'
        });
      });
  }, []);

  if (!settings || !settings.bannerActive || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#2B1E16] via-[#4A3B32] to-[#2B1E16] text-[#FAF8F5] px-4 py-2 text-center text-xs sm:text-sm font-medium relative z-50 transition-all border-b border-white/10 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 pr-8 pl-4">
        <Gem size={13} className="animate-pulse text-[#d4956b] shrink-0" />
        <span className="tracking-wide">{settings.bannerText}</span>
        {settings.promoCode && (
          <span className="bg-white/15 border border-white/30 text-white font-mono px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider hidden sm:inline-block">
            {settings.promoCode}
          </span>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-sm font-bold p-1 cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
