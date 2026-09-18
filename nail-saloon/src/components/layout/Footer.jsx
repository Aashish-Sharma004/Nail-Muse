// src/components/layout/Footer.jsx
import { Heart, Globe, Share2, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="bg-[#2B1E16] text-[#FAF8F5] mt-auto">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-white/10">

          {/* Brand */}
          <div>
            <div className="text-2xl text-[#FAF8F5] mb-2" style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700 }}>
              NailMuse Studio
            </div>
            <p className="text-sm text-white/60 max-w-xs" style={{ lineHeight: '1.7' }}>
              Luxury nail care & artistry — crafted for elegance, designed for you.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms',   label: 'Terms of Service' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/careers', label: 'Careers' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[Globe, Share2, MessageCircle].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-all hover:-translate-y-0.5"
                aria-label="Social link"
              >
                <Icon size={16} className="text-white/70" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">
            © 2026 NailMuse Studio. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-[#d4956b]" fill="#d4956b" /> for nail lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;