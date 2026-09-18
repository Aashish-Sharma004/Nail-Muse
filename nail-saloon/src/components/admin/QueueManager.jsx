// src/components/admin/QueueManager.jsx
import { useState } from 'react';
import {
  Radio, Clock, User, Scissors,
  Timer, MessageSquare, RefreshCw, Zap,
  CheckCircle2, Play, AlertTriangle, ShieldCheck,
  ChevronRight, Calendar
} from 'lucide-react';

const statusOptions = ['On Schedule', 'Slightly Delayed', 'Running Late'];

const statusColors = {
  'On Schedule':      { bg: '#f0fdf4', border: '#86efac', text: '#16a34a' },
  'Slightly Delayed': { bg: '#fffbeb', border: '#fde68a', text: '#d97706' },
  'Running Late':     { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
};

const messagePresets = [
  "We are currently running on perfect schedule. Welcome!",
  "Running ~10 mins behind due to intricate custom 3D nail art. Thank you for your patience!",
  "Please check in with our front desk upon arrival for your complimentary espresso."
];

const QueueManager = ({ settings, onSaveSettings, bookings = [], onStatusChange, showToast }) => {
  const [form, setForm] = useState({
    queueEnabled:            settings?.queueEnabled            ?? true,
    queueStatus:             settings?.queueStatus             ?? 'On Schedule',
    currentlyServingSlot:    settings?.currentlyServingSlot    ?? '01:00 PM',
    currentlyServingName:    settings?.currentlyServingName    ?? '',
    currentlyServingService: settings?.currentlyServingService ?? '',
    estimatedWaitMinutes:    settings?.estimatedWaitMinutes    ?? 15,
    queueMessage:            settings?.queueMessage            ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('Active'); // 'Active' or 'All'

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async (overrideData = {}) => {
    setSaving(true);
    try {
      const merged = { ...settings, ...form, ...overrideData, queueLastUpdatedAt: new Date().toISOString() };
      await onSaveSettings(merged);
      showToast?.('Live Queue published to all client devices successfully!');
    } catch (e) {
      console.error(e);
      showToast?.('Error publishing queue changes');
    } finally {
      setSaving(false);
    }
  };

  // 1-Click "Call to Station" for any real customer booking
  const handleCallClient = async (b) => {
    const clientName = b.userEmail ? b.userEmail.split('@')[0] : 'Valued Client';
    const updatedForm = {
      ...form,
      currentlyServingSlot: b.time || '12:00 PM',
      currentlyServingName: clientName,
      currentlyServingService: b.serviceTitle || 'Nail Treatment',
      queueEnabled: true,
    };
    setForm(updatedForm);

    // Update booking status in MongoDB
    if (onStatusChange && b._id) {
      await onStatusChange(b._id, 'In-Service');
    }

    // Immediately publish to live settings
    await handleSave(updatedForm);
    showToast?.(`Now serving ${clientName} (${b.serviceTitle}) at Station 01!`);
  };

  // 1-Click "Complete" for a booking
  const handleCompleteClient = async (b) => {
    if (onStatusChange && b._id) {
      await onStatusChange(b._id, 'Completed');
    }
    showToast?.(`Marked appointment for ${b.userEmail} as Completed!`);
  };

  // Quick wait time adjustments
  const adjustWait = (delta) => {
    const newVal = Math.max(0, Math.min(120, (form.estimatedWaitMinutes || 0) + delta));
    set('estimatedWaitMinutes', newVal);
  };

  const sc = statusColors[form.queueStatus] ?? statusColors['On Schedule'];

  // Filter bookings for the queue stream
  const activeBookings = bookings.filter(b => {
    if (bookingFilter === 'Active') {
      return b.status === 'Confirmed' || b.status === 'In-Service';
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 940, margin: '0 auto', fontFamily: "'Josefin Sans', sans-serif" }} className="animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio size={18} className="text-amber-700 animate-pulse" />
            <h2 className="font-serif text-2xl text-[#2B1E16] font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Live Salon Queue Command Center
            </h2>
          </div>
          <p className="text-xs text-[#6B5344] leading-relaxed">
            Control currently serving appointments, delay statuses, and broadcast notifications. Changes update client Live Trackers in real time.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#2B1E16] text-[#FAF8F5] rounded-2xl text-xs font-bold hover:bg-[#4A3B32] transition-all shadow-md disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Radio size={14} />}
          {saving ? 'Publishing...' : 'Publish to Live Queue'}
        </button>
      </div>

      {/* Master Queue Toggle & Pace Banner */}
      <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => set('queueEnabled', !form.queueEnabled)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer shrink-0 ${
              form.queueEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md"></div>
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5344]">System Status</span>
            <h4 className="text-base font-bold text-[#2B1E16]">
              {form.queueEnabled ? '🟢 Queue Broadcasting is LIVE' : '🔴 Queue Broadcasting is PAUSED'}
            </h4>
            <p className="text-xs text-[#6B5344]">
              {form.queueEnabled ? 'Clients see live technician countdowns & station alerts' : 'Clients see offline confirmation notice'}
            </p>
          </div>
        </div>

        {/* Status Pace Selector */}
        <div className="flex items-center gap-2">
          {statusOptions.map(opt => {
            const active = form.queueStatus === opt;
            const c = statusColors[opt];
            return (
              <button
                key={opt}
                onClick={() => set('queueStatus', opt)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  active ? 'shadow-xs scale-105' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: active ? c.bg : '#FAF8F5',
                  borderColor: active ? c.border : '#EDE5D8',
                  color: active ? c.text : '#4A3B32'
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left 2 Cols: Currently Serving & Wait Time Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Station 01: Currently Serving */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4A3B32] flex items-center gap-1.5">
                <Scissors size={14} /> Station 01: Serving Right Now
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Active Chair
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B5344] mb-1 block">Slot Time</label>
                <input
                  type="text"
                  value={form.currentlyServingSlot}
                  onChange={e => set('currentlyServingSlot', e.target.value)}
                  placeholder="e.g. 01:00 PM"
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] font-semibold focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B5344] mb-1 block">Client Name / Email</label>
                <input
                  type="text"
                  value={form.currentlyServingName}
                  onChange={e => set('currentlyServingName', e.target.value)}
                  placeholder="e.g. Jessica R."
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] font-semibold focus:outline-none focus:border-[#2B1E16]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#6B5344] mb-1 block">Service Name</label>
                <input
                  type="text"
                  value={form.currentlyServingService}
                  onChange={e => set('currentlyServingService', e.target.value)}
                  placeholder="e.g. Gel-X Extensions"
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] font-semibold focus:outline-none focus:border-[#2B1E16]"
                />
              </div>
            </div>
          </div>

          {/* Wait Time & Quick Adjust */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4A3B32] flex items-center gap-1.5">
                <Timer size={14} /> Estimated Wait Time Calibration
              </span>
              <span className="text-xl font-serif font-bold text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {form.estimatedWaitMinutes} Minutes
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={120}
                step={5}
                value={form.estimatedWaitMinutes}
                onChange={e => set('estimatedWaitMinutes', Number(e.target.value))}
                className="flex-1 accent-[#2B1E16] cursor-pointer"
              />
            </div>

            {/* Quick adjust buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-[#6B5344] mr-1">Quick Calibrate:</span>
              <button
                onClick={() => set('estimatedWaitMinutes', 0)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#2B1E16] cursor-pointer"
              >
                Reset 0m
              </button>
              <button
                onClick={() => adjustWait(5)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#2B1E16] cursor-pointer"
              >
                +5 Min
              </button>
              <button
                onClick={() => adjustWait(10)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#2B1E16] cursor-pointer"
              >
                +10 Min
              </button>
              <button
                onClick={() => adjustWait(15)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#2B1E16] cursor-pointer"
              >
                +15 Min
              </button>
              <button
                onClick={() => adjustWait(-10)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#2B1E16] cursor-pointer"
              >
                -10 Min
              </button>
            </div>
          </div>

          {/* Broadcast Message & Presets */}
          <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A3B32] flex items-center gap-1.5">
              <MessageSquare size={14} /> Live Broadcast Notice to Clients
            </span>

            <textarea
              rows={2}
              value={form.queueMessage}
              onChange={e => set('queueMessage', e.target.value)}
              placeholder="e.g. 'We are running 10 mins delayed due to intricate nail art. Please enjoy a complimentary latte!'"
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-[#6B5344] mr-1">Presets:</span>
              {messagePresets.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => set('queueMessage', msg)}
                  className="text-[10px] px-2.5 py-1 bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#4A3B32] truncate max-w-[200px] cursor-pointer"
                  title={msg}
                >
                  "{msg.slice(0, 30)}..."
                </button>
              ))}
              {form.queueMessage && (
                <button
                  onClick={() => set('queueMessage', '')}
                  className="text-[10px] px-2.5 py-1 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer ml-auto"
                >
                  Clear Message
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Live Client Preview Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#2B1E16] to-[#3d2a1e] text-[#FAF8F5] rounded-3xl p-6 shadow-lg border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                Customer Screen Preview
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/60">Now Serving</span>
              <h3 className="text-2xl font-serif font-bold text-white mt-0.5" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                {form.currentlyServingSlot || '12:30 PM'}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                {form.currentlyServingName || 'Open Station'}
                {form.currentlyServingService ? ` · ${form.currentlyServingService}` : ''}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-white/60">Est. Wait</span>
                <p className="text-lg font-bold text-amber-300 font-mono">
                  {form.estimatedWaitMinutes}m 00s
                </p>
              </div>
              <span 
                className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{ background: sc.bg, color: sc.text }}
              >
                {form.queueStatus}
              </span>
            </div>

            {form.queueMessage && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 leading-relaxed italic">
                "{form.queueMessage}"
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Today's Real Bookings Stream for Queue Management ── */}
      <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#F0EBE1]">
          <div>
            <h3 className="text-xl font-serif text-[#2B1E16] font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Booked Appointments Queue ({activeBookings.length})
            </h3>
            <p className="text-xs text-[#6B5344]">
              Real customer appointments from MongoDB. Click "Call to Station" to immediately push that client live to the customer tracker!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#EDE5D8]">
            <button
              onClick={() => setBookingFilter('Active')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bookingFilter === 'Active' ? 'bg-[#2B1E16] text-[#FAF8F5]' : 'text-[#4A3B32]'
              }`}
            >
              Active Queue
            </button>
            <button
              onClick={() => setBookingFilter('All')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bookingFilter === 'All' ? 'bg-[#2B1E16] text-[#FAF8F5]' : 'text-[#4A3B32]'
              }`}
            >
              All History
            </button>
          </div>
        </div>

        {activeBookings.length === 0 ? (
          <div className="py-12 text-center text-[#6B5344] space-y-2">
            <Calendar size={32} className="mx-auto text-[#D6C9B8]" />
            <p className="font-serif text-base text-[#2B1E16]">No active appointments in this view</p>
            <p className="text-xs">When clients book treatments online, their slots appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((b) => {
              const clientName = b.userEmail ? b.userEmail.split('@')[0] : 'Client';
              const isInService = b.status === 'In-Service' || form.currentlyServingSlot === b.time;
              const isCompleted = b.status === 'Completed';

              return (
                <div
                  key={b._id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    isInService
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : isCompleted
                      ? 'bg-[#FAF8F5] border-[#EDE5D8] opacity-75'
                      : 'bg-white border-[#EDE5D8] hover:border-[#2B1E16]'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#2B1E16] bg-[#FAF8F5] border border-[#EDE5D8] px-2 py-0.5 rounded-md">
                        ⏰ {b.time}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#2B1E16]">{b.serviceTitle}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        b.status === 'In-Service'
                          ? 'bg-amber-200 text-amber-900 animate-pulse'
                          : b.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#F0EBE1] text-[#2B1E16]'
                      }`}>
                        {b.status || 'Confirmed'}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B5344]">
                      Client: <strong className="text-[#2B1E16]">{b.userEmail}</strong> • Stylist: {b.technicianName} • Date: {b.date}
                    </p>
                  </div>

                  {/* Actions for this booking */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {!isCompleted && (
                      <button
                        onClick={() => handleCallClient(b)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                          isInService
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-[#2B1E16] text-[#FAF8F5] hover:bg-[#4A3B32]'
                        }`}
                        title="Set as currently serving client in live queue"
                      >
                        <Play size={12} /> {isInService ? 'Serving Now' : 'Call to Station'}
                      </button>
                    )}

                    {b.status !== 'Completed' && (
                      <button
                        onClick={() => handleCompleteClient(b)}
                        className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Mark service finished"
                      >
                        <CheckCircle2 size={13} /> Complete
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default QueueManager;
