// src/pages/Dashboard/LiveTracker.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getQueueStatus, getUserBookings } from '../../services/api';
import { Radio, Clock, RefreshCw, WifiOff, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

const POLL_MS = 12000; // re-fetch every 12 seconds

const STATUS_STYLE = {
  'On Schedule':      { color: '#16a34a', bg: 'rgba(22,163,74,0.15)'  },
  'Slightly Delayed': { color: '#d97706', bg: 'rgba(217,119,6,0.15)'  },
  'Running Late':     { color: '#dc2626', bg: 'rgba(220,38,38,0.15)'  },
};

// ── Format mm:ss countdown ────────────────────────────────────────────────────
function fmtCountdown(secs) {
  if (!secs || secs <= 0) return '0m 00s';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

// ── SVG Ring ─────────────────────────────────────────────────────────────────
function Ring({ pct }) {
  const R = 52, CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - Math.max(0, Math.min(1, pct)));
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
      <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
      <circle cx="60" cy="60" r={R} fill="none" stroke="#d4956b" strokeWidth="9"
        strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
        className="transition-all duration-1000" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const LiveTracker = () => {
  const { user } = useAuth();

  const [queue, setQueue]         = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [online, setOnline]       = useState(true);
  const [lastSync, setLastSync]   = useState(null);
  const [now, setNow]             = useState(new Date());
  const [secondsLeft, setSecondsLeft] = useState(null);

  const countdownRef = useRef(null);
  const initialSecsRef = useRef(null);

  // ── Live clock ──
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Fetch queue settings ──
  const fetchQueue = useCallback(async () => {
    try {
      const res = await getQueueStatus();
      const data = res.data;
      setQueue(data);
      setOnline(true);
      setLastSync(new Date());

      // Reset countdown when wait minutes change
      const newSecs = (data.estimatedWaitMinutes || 0) * 60;
      if (newSecs !== initialSecsRef.current) {
        initialSecsRef.current = newSecs;
        setSecondsLeft(newSecs);
      }
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const poll = setInterval(fetchQueue, POLL_MS);
    return () => clearInterval(poll);
  }, [fetchQueue]);

  // ── Local countdown tick ──
  useEffect(() => {
    clearInterval(countdownRef.current);
    if (!secondsLeft || secondsLeft <= 0) return;
    countdownRef.current = setInterval(() =>
      setSecondsLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(countdownRef.current);
  }, [secondsLeft]);

  // ── Fetch user's bookings ──
  useEffect(() => {
    if (!user?.email) return;
    getUserBookings(user.email)
      .then(res => setUserBookings(res.data || []))
      .catch(() => {});
  }, [user]);

  // ── Derive active user booking ──────────────────────────────────────────
  const activeBooking =
    userBookings.find(b => b.status === 'In-Service') ||
    userBookings.find(b => b.status === 'Confirmed') ||
    null;

  const userSlot    = activeBooking?.time || null;
  const userService = activeBooking?.serviceTitle || null;
  const userTech    = activeBooking?.technicianName || 'Your Artist';
  const userStatus  = activeBooking?.status || null;

  // ── Is user currently being served? ──────────────────────────────────────
  const isMyTurn = Boolean(
    userStatus === 'In-Service' ||
    (userSlot && queue?.currentlyServingSlot &&
      userSlot.trim().toLowerCase() === queue.currentlyServingSlot.trim().toLowerCase())
  );

  const sc  = STATUS_STYLE[queue?.queueStatus] || STATUS_STYLE['On Schedule'];
  const pct = initialSecsRef.current > 0 ? (secondsLeft || 0) / initialSecsRef.current : 0;
  const fmtTime = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <RefreshCw size={36} className="text-[#8B5E3C] animate-spin mx-auto mb-4" />
        <p className="font-serif text-xl text-[#2B1E16]">Connecting to Live Queue...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-5">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                ${queue?.queueEnabled ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5
                ${queue?.queueEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-widest
              ${queue?.queueEnabled ? 'text-emerald-700' : 'text-rose-600'}`}>
              {queue?.queueEnabled ? 'Live Queue Active' : 'Queue Offline'}
            </span>
            {!online && (
              <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                <WifiOff size={10} /> Cached
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2B1E16]">Live Queue Tracker</h1>
          <p className="text-xs text-[#6B5344] mt-1">
            Auto-refreshes every 12s · Last sync: {lastSync ? fmtTime(lastSync) : '—'}
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs font-semibold text-[#2B1E16] hover:bg-[#FAF8F5] transition-all shadow-sm cursor-pointer flex-shrink-0"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* ── Queue Paused banner ──────────────────────────────────────────── */}
      {!queue?.queueEnabled && (
        <div className="bg-white border border-[#EDE5D8] rounded-2xl p-6 text-center shadow-sm space-y-2">
          <AlertCircle size={32} className="text-amber-500 mx-auto" />
          <p className="font-serif text-lg font-bold text-[#2B1E16]">Queue Broadcasting is Paused</p>
          <p className="text-xs text-[#6B5344] max-w-sm mx-auto">
            The salon is not broadcasting live updates right now. Your booking is confirmed — please arrive at your scheduled time.
          </p>
          {activeBooking && (
            <div className="inline-block mt-2 px-4 py-2 bg-[#FAF8F5] border border-[#EDE5D8] rounded-xl text-xs font-semibold text-[#2B1E16]">
              Your appointment: {userSlot} · {userService}
            </div>
          )}
        </div>
      )}

      {/* ── It's Your Turn banner ────────────────────────────────────────── */}
      {queue?.queueEnabled && isMyTurn && (
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg animate-pulse"
             style={{ background: 'linear-gradient(135deg, #065f46, #047857)' }}>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={22} className="text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">
              It&apos;s Your Turn!
            </span>
            <p className="font-serif text-xl font-bold text-white mt-1">Your service is underway at Station 01!</p>
            <p className="text-xs text-white/80">Please take a seat with {userTech}. Enjoy your treatment 💅</p>
          </div>
        </div>
      )}

      {/* ── Main dark stats card ─────────────────────────────────────────── */}
      {queue?.queueEnabled && (
        <div className="rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #2B1E16 0%, #3d2a1e 50%, #2B1E16 100%)' }}>

          {/* Ambient glow */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#d4956b]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Status bar */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/15 flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}50` }}>
                <Radio size={11} className="animate-pulse" />
                {queue.queueStatus || 'On Schedule'}
              </span>
              <span className="text-xs text-white/60 flex items-center gap-1.5">
                <Clock size={13} />
                <span className="font-mono font-bold text-white">{fmtTime(now)}</span>
              </span>
            </div>

            {/* 3-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

              {/* Now Serving */}
              <div className="md:border-r border-white/15 md:pr-6">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-200/70 mb-2">Now Serving</p>
                <p className="font-serif text-3xl font-bold text-white leading-tight">
                  {queue.currentlyServingSlot || '—'}
                </p>
                <p className="text-xs text-white/70 mt-1">
                  {queue.currentlyServingName
                    ? <>{queue.currentlyServingName} · <span className="text-white/50">{queue.currentlyServingService}</span></>
                    : 'Station open'}
                </p>
              </div>

              {/* Countdown ring */}
              <div className="text-center md:border-r border-white/15 md:px-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-200/70 mb-2">Est. Wait</p>
                <div className="relative w-[120px] h-[120px] mx-auto">
                  <Ring pct={pct} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-base font-bold text-white leading-none">
                      {fmtCountdown(secondsLeft)}
                    </span>
                    <span className="text-[9px] uppercase text-white/50 mt-1">remaining</span>
                  </div>
                </div>
              </div>

              {/* Your appointment */}
              <div className="md:pl-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-200/70 mb-2">Your Slot</p>
                {activeBooking ? (
                  <>
                    <p className="font-serif text-3xl font-bold text-white">{userSlot}</p>
                    <p className="text-xs text-white/80 mt-1 font-medium">{userService}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">with {userTech}</p>
                    <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full
                      ${isMyTurn ? 'bg-emerald-400 text-emerald-950' : 'bg-white/15 text-white'}`}>
                      {isMyTurn ? '⭐ In Service Now' : '⏳ Up Next'}
                    </span>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">No active booking found.</p>
                    <Link to="/services"
                          className="inline-block bg-[#d4956b] text-[#2B1E16] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#e6ab83] transition-colors">
                      Book a Service →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Broadcast message */}
            {queue.queueMessage && (
              <div className="mt-5 pt-5 border-t border-white/10 flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">📢</span>
                <span><strong className="text-white">Salon Notice:</strong> {queue.queueMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Queue Timeline (real bookings) ───────────────────────────────── */}
      {queue?.queueEnabled && (
        <QueueTimeline userSlot={userSlot} isMyTurn={isMyTurn} queue={queue} />
      )}

    </div>
  );
};

// ── Queue Timeline component ──────────────────────────────────────────────────
function QueueTimeline({ userSlot, isMyTurn, queue }) {
  return (
    <div className="bg-white border border-[#EDE5D8] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0EBE1] flex items-center justify-between">
        <h3 className="font-serif text-base font-bold text-[#2B1E16]">Station Timeline</h3>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="divide-y divide-[#F5F0EB]">
        {/* Completed slot */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-8 h-8 rounded-full bg-[#EDE5D8] text-[#6B5344] flex items-center justify-center flex-shrink-0">
            <CheckCircle size={15} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#2B1E16]">Previous Session</p>
            <p className="text-[11px] text-[#6B5344]">Station sanitised &amp; ready</p>
          </div>
          <span className="text-[10px] font-bold uppercase bg-[#EDE5D8] text-[#6B5344] px-2 py-0.5 rounded-full">Done</span>
        </div>

        {/* Currently serving */}
        <div className="flex items-center gap-3 px-5 py-4 bg-amber-50">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
            <Radio size={14} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#2B1E16]">
              {queue.currentlyServingSlot || 'Now'}
              <span className="ml-2 text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md">Active</span>
            </p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              {queue.currentlyServingName
                ? `Serving ${queue.currentlyServingName} — ${queue.currentlyServingService || 'Treatment'}`
                : 'Station in session'}
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">In-Service</span>
        </div>

        {/* User slot */}
        {userSlot && (
          <div className={`flex items-center gap-3 px-5 py-4
            ${isMyTurn ? 'bg-emerald-900' : 'bg-[#2B1E16]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0
              ${isMyTurn ? 'bg-amber-400 text-emerald-950' : 'bg-white text-[#2B1E16]'}`}>
              YOU
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">
                {userSlot}
                <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md
                  ${isMyTurn ? 'bg-amber-400 text-emerald-950' : 'bg-white/20 text-white'}`}>
                  {isMyTurn ? 'At Station Now' : 'Your Slot'}
                </span>
              </p>
              <p className="text-[11px] text-white/70 mt-0.5">Your reserved appointment</p>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
              ${isMyTurn ? 'bg-white text-emerald-900' : 'bg-white/20 text-white'}`}>
              {isMyTurn ? 'In Progress' : 'Up Next'}
            </span>
          </div>
        )}

        {/* Upcoming */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-8 h-8 rounded-full bg-[#EDE5D8] text-[#6B5344] flex items-center justify-center flex-shrink-0">
            <Clock size={14} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#2B1E16]">Upcoming Sessions</p>
            <p className="text-[11px] text-[#6B5344]">Reserved slots following in queue</p>
          </div>
          <span className="text-[10px] font-bold uppercase bg-[#EDE5D8] text-[#6B5344] px-2 py-0.5 rounded-full">Scheduled</span>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-[#F0EBE1] text-[11px] text-[#6B5344]">
        ℹ️ Queue refreshes automatically every 12 seconds. Walk-ins welcome subject to availability.
      </div>
    </div>
  );
}

export default LiveTracker;