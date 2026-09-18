// src/components/admin/OffersManager.jsx
import { useState, useEffect } from 'react';
import {
  Mail, Send, Sparkles, Tag, Users, CheckCircle2,
  ExternalLink, Trash2, Clock, Calendar, Ticket,
  Percent, Eye, RefreshCw, AlertCircle, Check, ChevronRight
} from 'lucide-react';
import { sendCustomerOffer, getOfferCampaigns, deleteOfferCampaign } from '../../services/api';

const offerTemplates = [
  {
    name: 'Spring Glamour (20% Off)',
    icon: '🌸',
    subject: '✨ Spring Glam Special: 20% Off Gel-X Sets & Nail Art',
    headline: 'Step into the Season with Flawless Nails',
    promoCode: 'GLAM20',
    discount: '20% OFF',
    validUntil: 'October 31, 2026',
    message: 'Treat yourself to our signature Apres Gel-X extensions or bespoke minimalist nail art. Use the voucher code below during checkout for an exclusive 20% savings on your entire session.'
  },
  {
    name: 'VIP Member Perk ($15 Credit)',
    icon: '👑',
    subject: '👑 VIP Member Perk: Complimentary $15 Nail Art Voucher',
    headline: 'Because You Deserve Luxury',
    promoCode: 'VIPGEMS',
    discount: '$15 CREDIT',
    validUntil: 'November 15, 2026',
    message: 'As a valued member of the NailMuse VIP Club, enjoy a complimentary $15 credit towards Swarovski crystals, chrome powders, or restorative IBX strengthening treatments.'
  },
  {
    name: 'Weekend Spa Pedicure (15% Off)',
    icon: '💆‍♀️',
    subject: '🌸 Weekend Rejuvenation: 15% Off Spa Pedicures',
    headline: 'Unwind with Our Signature Spa Pedicure',
    promoCode: 'PEDIPAMPER',
    discount: '15% OFF',
    validUntil: 'Valid this Weekend',
    message: 'Relax with our therapeutic warm foot soak, exfoliation scrub, and extended lower-leg massage. Perfect for unwinding after a busy week.'
  },
  {
    name: 'Personal Thank You (10% Off)',
    icon: '💖',
    subject: '💖 A Special Thank You from the NailMuse Team',
    headline: 'We Loved Having You at the Studio',
    promoCode: 'THANKYOU10',
    discount: '10% OFF',
    validUntil: 'Valid 30 Days',
    message: 'Thank you for choosing NailMuse Studio for your nail care. As our token of appreciation, please enjoy 10% off your next appointment.'
  }
];

const OffersManager = ({ users = [], initialTargetEmail = '', showToast }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Form fields
  const [recipientType, setRecipientType] = useState(initialTargetEmail ? 'individual' : 'all');
  const [targetEmail, setTargetEmail] = useState(initialTargetEmail || '');
  const [targetTier, setTargetTier] = useState('Gold VIP Member');
  const [subject, setSubject] = useState(offerTemplates[0].subject);
  const [headline, setHeadline] = useState(offerTemplates[0].headline);
  const [promoCode, setPromoCode] = useState(offerTemplates[0].promoCode);
  const [discount, setDiscount] = useState(offerTemplates[0].discount);
  const [validUntil, setValidUntil] = useState(offerTemplates[0].validUntil);
  const [message, setMessage] = useState(offerTemplates[0].message);

  // When initialTargetEmail changes (e.g. from Clients table)
  useEffect(() => {
    if (initialTargetEmail) {
      setRecipientType('individual');
      setTargetEmail(initialTargetEmail);
    }
  }, [initialTargetEmail]);

  // Load past campaigns
  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const res = await getOfferCampaigns();
      setCampaigns(res.data || []);
    } catch (e) {
      console.warn('Could not load campaigns:', e);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleApplyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setHeadline(tpl.headline);
    setPromoCode(tpl.promoCode);
    setDiscount(tpl.discount);
    setValidUntil(tpl.validUntil);
    setMessage(tpl.message);
    showToast?.(`Loaded template: ${tpl.name}`);
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both the Subject and Message body.');
      return;
    }
    if (recipientType === 'individual' && (!targetEmail || !targetEmail.includes('@'))) {
      alert('Please provide a valid customer email address.');
      return;
    }

    setSending(true);
    setLastResult(null);

    try {
      const payload = {
        recipientType,
        targetEmail: recipientType === 'individual' ? targetEmail.trim() : undefined,
        targetTier: recipientType === 'tier' ? targetTier : undefined,
        subject,
        headline,
        message,
        promoCode,
        discount,
        validUntil,
        sentBy: 'admin@nailmuse.com'
      };

      const res = await sendCustomerOffer(payload);
      const data = res.data;
      setLastResult(data);
      showToast?.(data.message || 'Direct offer email dispatched successfully!');
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to send offer. Please check recipient email.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Remove this campaign log entry?')) return;
    try {
      await deleteOfferCampaign(id);
      setCampaigns(prev => prev.filter(c => c._id !== id));
      showToast?.('Campaign record removed');
    } catch (e) {
      console.error(e);
      alert('Failed to delete campaign log');
    }
  };

  // Compute recipient count preview
  const estimatedAudienceCount = () => {
    if (recipientType === 'individual') return 1;
    if (recipientType === 'tier') {
      return users.filter(u => u.tier === targetTier).length || 1;
    }
    return Math.max(users.length, 1);
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', fontFamily: "'Josefin Sans', sans-serif" }} className="animate-fade-in space-y-8">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={20} className="text-amber-700" />
            <h2 className="font-serif text-2xl text-[#2B1E16] font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Customer Email Offers & Direct Messaging
            </h2>
          </div>
          <p className="text-xs text-[#6B5344] leading-relaxed">
            Compose and broadcast luxury branded promotional emails, exclusive discount vouchers, and direct notices to your clients.
          </p>
        </div>

        <button
          onClick={fetchCampaigns}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs font-semibold text-[#2B1E16] hover:bg-[#FAF8F5] transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <RefreshCw size={13} className={loadingCampaigns ? 'animate-spin' : ''} /> Refresh History
        </button>
      </div>

      {/* Success Notification Alert */}
      {lastResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-900">{lastResult.message}</p>
              <p className="text-emerald-800/80 mt-0.5">Dispatched to real customer inbox via Nodemailer</p>
            </div>
          </div>
          {lastResult.previewUrl && (
            <a
              href={lastResult.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-xl font-bold text-xs hover:bg-emerald-900 transition-colors shrink-0"
            >
              <span>View Rendered Email</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Template Preset Selector */}
      <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B5344] flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-600" /> Pre-Designed Luxury Offer Templates
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {offerTemplates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] text-left hover:border-[#2B1E16] hover:bg-white transition-all group cursor-pointer shadow-2xs"
            >
              <span className="text-xl mb-1 block">{tpl.icon}</span>
              <h4 className="font-serif font-bold text-xs text-[#2B1E16] group-hover:text-amber-800 transition-colors leading-snug">
                {tpl.name}
              </h4>
              <p className="text-[11px] text-[#6B5344] mt-1 font-mono font-semibold">
                Code: {tpl.promoCode}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Composer & Live Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Email Composer Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSendOffer} className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
              <h3 className="font-serif text-lg text-[#2B1E16] font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Compose Customer Offer Email
              </h3>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Audience: ~{estimatedAudienceCount()} Client(s)
              </span>
            </div>

            {/* Audience Selector */}
            <div>
              <label className="text-[11px] uppercase font-bold text-[#6B5344] mb-2 block">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'All Clients', icon: '🌐' },
                  { id: 'individual', label: 'Specific Client', icon: '👤' },
                  { id: 'tier', label: 'VIP Tier', icon: '👑' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRecipientType(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      recipientType === item.id
                        ? 'bg-[#2B1E16] text-[#FAF8F5] border-[#2B1E16] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#EDE5D8] text-[#4A3B32] hover:bg-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Client Input */}
            {recipientType === 'individual' && (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] space-y-2 animate-fade-in">
                <label className="text-[10px] uppercase font-bold text-[#6B5344] block">
                  Customer Email Address
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={e => setTargetEmail(e.target.value)}
                    placeholder="e.g. client@example.com"
                    className="flex-1 px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                  />
                  {users.length > 0 && (
                    <select
                      onChange={e => { if (e.target.value) setTargetEmail(e.target.value); }}
                      className="px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Pick from VIP List...</option>
                      {users.map(u => (
                        <option key={u._id} value={u.email}>{u.name || u.email} ({u.email})</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            {/* VIP Tier Selector */}
            {recipientType === 'tier' && (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] space-y-2 animate-fade-in">
                <label className="text-[10px] uppercase font-bold text-[#6B5344] block">Select Loyalty Tier</label>
                <select
                  value={targetTier}
                  onChange={e => setTargetTier(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] font-semibold focus:outline-none"
                >
                  <option value="Gold VIP Member">Gold VIP Member (400+ Pts)</option>
                  <option value="Platinum Elite">Platinum Elite</option>
                  <option value="Silver Client">Silver Client</option>
                </select>
              </div>
            )}

            {/* Subject Line */}
            <div>
              <label className="text-[11px] uppercase font-bold text-[#6B5344] mb-1 block">
                Email Subject Line
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. ✨ Exclusive 20% Off Gel-X Sets"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] font-semibold focus:outline-none focus:border-[#2B1E16]"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="text-[11px] uppercase font-bold text-[#6B5344] mb-1 block">
                Offer Title / Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Step into Spring with Pristine Nails"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
              />
            </div>

            {/* Promo Code, Discount & Expiry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B5344] mb-1 block">Promo Code</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GLAM20"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs font-mono font-bold text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B5344] mb-1 block">Discount Tag</label>
                <input
                  type="text"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  placeholder="e.g. 20% OFF"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs font-semibold text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B5344] mb-1 block">Valid Until</label>
                <input
                  type="text"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                  placeholder="e.g. Oct 31, 2026"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-[11px] uppercase font-bold text-[#6B5344] mb-1 block">
                Direct Message Content
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your personalized invitation or promotional details here..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#6B5344]">
                Emails are styled in responsive HTML letterhead
              </span>
              
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-7 py-3 bg-[#2B1E16] text-[#FAF8F5] rounded-2xl text-xs font-bold hover:bg-[#4A3B32] transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? 'Dispatching Emails...' : 'Send Direct Offer to Customer(s)'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Email Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A3B32] flex items-center gap-1.5">
              <Eye size={14} /> Live Inbox Preview
            </span>
            <span className="text-[10px] font-mono text-[#6B5344]">What Customer Sees</span>
          </div>

          {/* Email Container Replica */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl overflow-hidden shadow-lg text-left">
            
            {/* Dark Brand Header */}
            <div className="bg-gradient-to-br from-[#2B1E16] to-[#3d2a1e] p-6 text-center text-[#FAF8F5]">
              <h3 className="font-serif text-xl font-bold tracking-wide" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                NailMuse Studio
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-[#d4956b] font-bold mt-1">
                Boutique Nail Spa & Atelier
              </p>
            </div>

            {/* Email Inner Body */}
            <div className="p-6 space-y-4 text-xs text-[#4A3B32]">
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#6B5344]">
                Special Invitation for {recipientType === 'individual' && targetEmail ? targetEmail.split('@')[0] : 'Valued Client'}
              </p>

              <h4 className="font-serif text-base font-bold text-[#2B1E16] leading-snug" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {headline || 'Exclusive Salon Offer'}
              </h4>

              <p className="leading-relaxed whitespace-pre-line text-xs">
                {message || 'Your personalized promotional offer details will appear here.'}
              </p>

              {/* Voucher Ticket Box */}
              {promoCode && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#d4956b] text-center space-y-2">
                  {discount && (
                    <span className="inline-block bg-[#2B1E16] text-[#FAF8F5] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      {discount}
                    </span>
                  )}
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#6B5344]">Voucher Code</p>
                  <p className="font-mono text-xl font-bold tracking-widest text-[#2B1E16] bg-white py-1 px-4 rounded-lg border border-[#EDE5D8] inline-block">
                    {promoCode}
                  </p>
                  {validUntil && (
                    <p className="text-[10px] text-[#8A7363]">Valid through: <strong>{validUntil}</strong></p>
                  )}
                </div>
              )}

              {/* Book Now Button */}
              <div className="text-center pt-2">
                <span className="inline-block bg-[#2B1E16] text-[#FAF8F5] text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm">
                  Book Your Treatment &rarr;
                </span>
                <p className="text-[10px] text-[#8A7363] mt-2">
                  Apply code <strong className="text-[#2B1E16]">{promoCode || 'at booking'}</strong> during checkout
                </p>
              </div>
            </div>

            {/* Email Footer */}
            <div className="bg-[#FAF8F5] border-t border-[#EDE5D8] p-4 text-center text-[10px] text-[#8A7363] space-y-1">
              <p className="font-bold text-[#2B1E16]">NailMuse Studio & Lounge</p>
              <p>452 Beverly Blvd, Los Angeles, CA • +1 (555) 342-6873</p>
              <p className="text-[9px] text-[#A89585]">VIP Member Exclusive Perks</p>
            </div>

          </div>
        </div>

      </div>

      {/* ── Sent Offers Campaign History ── */}
      <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
          <div>
            <h3 className="font-serif text-xl text-[#2B1E16] font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Sent Email Campaigns History ({campaigns.length})
            </h3>
            <p className="text-xs text-[#6B5344]">
              Audit log of previously broadcasted offers, promo vouchers, and direct client notices
            </p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="py-12 text-center text-[#6B5344] space-y-2">
            <Mail size={32} className="mx-auto text-[#D6C9B8]" />
            <p className="font-serif text-base text-[#2B1E16]">No email campaigns sent yet</p>
            <p className="text-xs">Use the composer above to broadcast your first promotional offer!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8] hover:bg-white hover:border-[#2B1E16] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#2B1E16]">{c.subject}</span>
                    {c.promoCode && (
                      <span className="font-mono text-[10px] font-bold bg-[#FAF8F5] border border-[#d4956b] text-amber-900 px-2 py-0.5 rounded-md">
                        {c.promoCode} {c.discount ? `(${c.discount})` : ''}
                      </span>
                    )}
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Sent to {c.recipientCount} {c.recipientCount === 1 ? 'client' : 'clients'}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B5344] line-clamp-1">
                    {c.message}
                  </p>

                  <p className="text-[11px] text-[#8A7363]">
                    Sent: {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Type: <strong className="capitalize">{c.recipientType}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {c.previewUrl && (
                    <a
                      href={c.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white border border-[#EDE5D8] hover:border-[#2B1E16] text-[#2B1E16] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="View rendered email preview"
                    >
                      <ExternalLink size={12} /> Preview
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteCampaign(c._id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default OffersManager;
