// src/components/admin/QueueManager.jsx
import { useState, useCallback } from 'react';
import { Radio, Clock, CheckCircle2, Play, XCircle, Zap, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'On Schedule',      color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
  { label: 'Slightly Delayed', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { label: 'Running Late',     color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
];

const QueueManager = ({ settings, onSaveSettings, bookings = [], onStatusChange, showToast }) => {
  // Derive local state from settings prop
  const [saving, setSaving] = useState(false);

  // All queue state lives in `settings` (MongoDB-synced via admin panel)
  const q = settings || {};

  // ── Helper: publish any partial update immediately ────────────────────────
  const publish = useCallback(async (patch) => {
    setSaving(true);
    try {
      await onSaveSettings({
        ...q,
        ...patch,
        queueLastUpdatedAt: new Date().toISOString(),
      });
    } catch (e) {
      showToast?.('Failed to update queue');
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, [q, onSaveSettings, showToast]);

  // ── 1-click: Call client to station ─────────────────────────────────────
  const callToStation = async (booking) => {
    const clientName = booking.userEmail?.split('@')[0] || 'Client';
    await publish({
      queueEnabled: true,
      currentlyServingSlot:    booking.time || '',
      currentlyServingName:    clientName,
      currentlyServingService: booking.serviceTitle || 'Nail Treatment',
    });
    if (onStatusChange && booking._id) {
      await onStatusChange(booking._id, 'In-Service');
    }
    showToast?.(`✅ Now serving ${clientName} at Station 01`);
  };

  // ── 1-click: Mark complete ───────────────────────────────────────────────
  const markComplete = async (booking) => {
    if (onStatusChange && booking._id) {
      await onStatusChange(booking._id, 'Completed');
    }
    // Clear station if this was the currently serving client
    const clientName = booking.userEmail?.split('@')[0] || '';
    if (q.currentlyServingName === clientName) {
      await publish({
        currentlyServingSlot:    '',
        currentlyServingName:    '',
        currentlyServingService: '',
      });
    }
    showToast?.(`✅ Appointment completed`);
  };

  // ── Toggle queue on/off ──────────────────────────────────────────────────
  const toggleQueue = () => publish({ queueEnabled: !q.queueEnabled });

  // ── Adjust wait ──────────────────────────────────────────────────────────
  const adjustWait = (delta) => {
    const newVal = Math.max(0, Math.min(120, (q.estimatedWaitMinutes || 0) + delta));
    publish({ estimatedWaitMinutes: newVal });
  };

  // ── Set status ───────────────────────────────────────────────────────────
  const setStatus = (label) => publish({ queueStatus: label });

  // ── Clear station ────────────────────────────────────────────────────────
  const clearStation = () => publish({
    currentlyServingSlot: '', currentlyServingName: '', currentlyServingService: '',
  });

  // Filtered: show active + confirmed bookings first
  const activeBookings = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'In-Service')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const allBookings = bookings
    .filter(b => b.status !== 'Cancelled')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const [showAll, setShowAll] = useState(false);
  const displayBookings = showAll ? allBookings : activeBookings;

  const sc = STATUS_OPTIONS.find(s => s.label === q.queueStatus) || STATUS_OPTIONS[0];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B1E16] flex items-center gap-2">
            <Radio size={20} className="text-amber-600 animate-pulse" />
            Live Queue Control
          </h2>
          <p className="text-xs text-[#6B5344] mt-0.5">Changes publish instantly to the client tracker.</p>
        </div>
        {saving && (
          <span className="flex items-center gap-1.5 text-xs text-[#4A3B32] bg-[#FAF8F5] border border-[#EDE5D8] px-3 py-1.5 rounded-full">
            <RefreshCw size={12} className="animate-spin" /> Publishing...
          </span>
        )}
      </div>

      {/* ── Row 1: Live Toggle + Status ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Toggle card */}
        <div className="bg-white border border-[#EDE5D8] rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B5344]">Queue Broadcasting</p>
            <p className={`font-serif text-lg font-bold mt-0.5 ${q.queueEnabled ? 'text-emerald-700' : 'text-rose-600'}`}>
              {q.queueEnabled ? '🟢 Live' : '🔴 Paused'}
            </p>
            <p className="text-[11px] text-[#6B5344] mt-0.5">
              {q.queueEnabled ? 'Clients see live updates' : 'Clients see offline notice'}
            </p>
          </div>
          <button
            onClick={toggleQueue}
            disabled={saving}
            className={`w-16 h-9 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer disabled:opacity-60 ${
              q.queueEnabled ? 'bg-emerald-500 justify-end' : 'bg-stone-300 justify-start'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Status card */}
        <div className="bg-white border border-[#EDE5D8] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B5344] mb-3">Salon Pace</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setStatus(opt.label)}
                disabled={saving}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer disabled:opacity-60"
                style={{
                  background:   q.queueStatus === opt.label ? opt.bg  : '#FAF8F5',
                  borderColor:  q.queueStatus === opt.label ? opt.border : '#EDE5D8',
                  color:        q.queueStatus === opt.label ? opt.color : '#4A3B32',
                  transform:    q.queueStatus === opt.label ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Currently Serving + Wait Time ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Currently serving */}
        <div className="bg-white border border-[#EDE5D8] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B5344]">Station 01 — Now Serving</p>
            {(q.currentlyServingName || q.currentlyServingSlot) && (
              <button
                onClick={clearStation}
                disabled={saving}
                className="text-[10px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <XCircle size={12} /> Clear
              </button>
            )}
          </div>

          {q.currentlyServingName || q.currentlyServingSlot ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-bold text-[#2B1E16] text-sm">{q.currentlyServingSlot || '—'}</p>
              <p className="text-xs text-amber-900 font-semibold mt-0.5">{q.currentlyServingName}</p>
              <p className="text-[11px] text-amber-700 mt-0.5">{q.currentlyServingService}</p>
            </div>
          ) : (
            <div className="p-3 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-center text-xs text-[#6B5344]">
              No one at station — click <strong>Call to Station</strong> below
            </div>
          )}
        </div>

        {/* Wait time */}
        <div className="bg-white border border-[#EDE5D8] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B5344]">Estimated Wait</p>
            <span className="font-serif text-xl font-bold text-[#2B1E16]">
              {q.estimatedWaitMinutes ?? 0}m
            </span>
          </div>

          <input
            type="range"
            min={0} max={120} step={5}
            value={q.estimatedWaitMinutes ?? 0}
            onChange={e => publish({ estimatedWaitMinutes: Number(e.target.value) })}
            className="w-full accent-[#2B1E16] cursor-pointer mb-3"
            disabled={saving}
          />

          <div className="flex gap-2 flex-wrap">
            {[0, 5, 10, 15, 20, 30].map(v => (
              <button
                key={v}
                onClick={() => publish({ estimatedWaitMinutes: v === 0 ? 0 : (q.estimatedWaitMinutes || 0) + v }
                )}
                disabled={saving}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE5D8] rounded-lg hover:bg-[#EDE5D8] text-[#2B1E16] cursor-pointer disabled:opacity-50"
              >
                {v === 0 ? 'Reset' : `+${v}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Today's Queue (bookings) ──────────────────────────────── */}
      <div className="bg-white border border-[#EDE5D8] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EBE1]">
          <div>
            <h3 className="font-serif text-base font-bold text-[#2B1E16]">
              Today&apos;s Queue
              <span className="ml-2 text-xs font-bold text-[#4A3B32] bg-[#FAF8F5] border border-[#EDE5D8] px-2 py-0.5 rounded-full">
                {activeBookings.length} active
              </span>
            </h3>
            <p className="text-[11px] text-[#6B5344] mt-0.5">Click <strong>Call to Station</strong> to set a client as currently serving</p>
          </div>
          <button
            onClick={() => setShowAll(v => !v)}
            className="text-xs text-[#4A3B32] underline underline-offset-2 cursor-pointer"
          >
            {showAll ? 'Active only' : 'Show all'}
          </button>
        </div>

        {displayBookings.length === 0 ? (
          <div className="py-12 text-center text-[#6B5344]">
            <Clock size={28} className="mx-auto text-[#D6C9B8] mb-2" />
            <p className="text-sm font-semibold text-[#2B1E16]">No active appointments</p>
            <p className="text-xs mt-1">Bookings from clients appear here automatically</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EBE1]">
            {displayBookings.map(b => {
              const clientName = b.userEmail?.split('@')[0] || 'Client';
              const isServing  = b.status === 'In-Service';
              const isDone     = b.status === 'Completed';

              return (
                <div
                  key={b._id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 transition-colors
                    ${isServing ? 'bg-amber-50' : isDone ? 'bg-[#FAFAFA] opacity-60' : 'bg-white hover:bg-[#FAF8F5]'}`}
                >
                  {/* Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isServing ? 'bg-amber-400 text-white animate-pulse' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EDE5D8] text-[#4A3B32]'}`}>
                      {isDone ? '✓' : isServing ? '💅' : (clientName[0] || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#2B1E16]">{b.time || '—'}</span>
                        <span className="text-xs text-[#4A3B32] truncate">{clientName}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                          ${isServing ? 'bg-amber-200 text-amber-900' : isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F0EBE1] text-[#4A3B32]'}`}>
                          {b.status || 'Confirmed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B5344] mt-0.5 truncate">
                        {b.serviceTitle} · {b.technicianName}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isDone && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => callToStation(b)}
                        disabled={saving}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50
                          ${isServing ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-[#2B1E16] text-white hover:bg-[#4A3B32]'}`}
                      >
                        <Play size={11} />
                        {isServing ? 'Serving' : 'Call to Station'}
                      </button>
                      <button
                        onClick={() => markComplete(b)}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 size={11} /> Done
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Live Preview Card ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#2B1E16] to-[#3d2a1e] text-white rounded-2xl p-5 shadow-lg border border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-3">Client Screen Preview</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">Now Serving</p>
            <p className="font-serif text-lg font-bold text-white mt-1">{q.currentlyServingSlot || '—'}</p>
            <p className="text-[11px] text-white/70">{q.currentlyServingName || 'Open'}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">Wait</p>
            <p className="font-serif text-lg font-bold text-amber-300 mt-1">{q.estimatedWaitMinutes ?? 0}m</p>
            <p className="text-[11px]" style={{ color: sc.color }}>{q.queueStatus || 'On Schedule'}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">Status</p>
            <p className={`font-bold text-sm mt-1 ${q.queueEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
              {q.queueEnabled ? 'LIVE' : 'PAUSED'}
            </p>
            <p className="text-[11px] text-white/60">Broadcasting</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QueueManager;
