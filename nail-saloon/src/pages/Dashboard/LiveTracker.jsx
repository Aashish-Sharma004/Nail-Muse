// src/pages/Dashboard/LiveTracker.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getQueueStatus, getUserBookings } from '../../services/api';
import {
  Clock, Users, Radio, ArrowLeft, RefreshCw,
  AlertCircle, CheckCircle, Timer, MessageSquare,
  Wifi, WifiOff, ChevronRight, Scissors, Calendar, User, Sparkles,
  CheckCircle2, Bell
} from 'lucide-react';

const POLL_INTERVAL = 15000; // 15 seconds

const statusConfig = {
  'On Schedule': { color: '#16a34a', bg: 'rgba(22,163,74,0.12)', label: 'On Schedule' },
  'Slightly Delayed': { color: '#d97706', bg: 'rgba(217,119,6,0.12)', label: 'Slightly Delayed' },
  'Running Late': { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', label: 'Running Late' },
};

const LiveTracker = () => {
  const { bookingData } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Live clock
  const [now, setNow] = useState(new Date());

  // Backend queue state from SalonSettings
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  // Active customer booking state
  const [activeBooking, setActiveBooking] = useState(null);

  // Local countdown (seconds), seeded from backend estimatedWaitMinutes
  const [secondsLeft, setSecondsLeft] = useState(null);
  const countdownRef = useRef(null);

  // ── 1. Live Clock ──
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // ── 2. Resolve Active Customer Booking ──
  useEffect(() => {
    // Priority 1: Passed via location state (e.g. from MyAccount)
    if (location.state?.booking) {
      setActiveBooking(location.state.booking);
      return;
    }

    // Priority 2: BookingData from active booking flow
    if (bookingData?.confirmedBooking) {
      setActiveBooking(bookingData.confirmedBooking);
      return;
    }
    if (bookingData?.service && bookingData?.time) {
      setActiveBooking({
        serviceTitle: bookingData.service.title,
        technicianName: bookingData.technician?.name || 'Assigned Specialist',
        date: bookingData.date || 'Today',
        time: bookingData.time,
        status: 'Confirmed'
      });
      return;
    }

    // Priority 3: LocalStorage persisted latest booking
    try {
      const storedLatest = localStorage.getItem('nailmuse_latest_booking');
      if (storedLatest) {
        const parsed = JSON.parse(storedLatest);
        if (parsed?.serviceTitle || parsed?.service) {
          setActiveBooking(parsed);
        }
      }
    } catch {}

    // Priority 4: Fetch from backend for logged in user
    if (user?.email) {
      getUserBookings(user.email)
        .then(res => {
          const bookings = res.data || [];
          if (bookings.length > 0) {
            // Pick most relevant active booking (In-Service or Confirmed)
            const active = bookings.find(b => b.status === 'In-Service' || b.status === 'Confirmed') || bookings[0];
            setActiveBooking(active);
          }
        })
        .catch(() => {});
    }
  }, [bookingData, location.state, user]);

  // ── 3. Fetch Queue Status from Backend ──
  const fetchQueue = useCallback(async () => {
    try {
      const res = await getQueueStatus();
      const data = res.data;
      setQueue(data);
      setOnline(true);
      setLastFetched(new Date());

      // Seed countdown from backend value (convert minutes → seconds)
      if (typeof data.estimatedWaitMinutes === 'number') {
        setSecondsLeft(data.estimatedWaitMinutes * 60);
      }
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const poll = setInterval(fetchQueue, POLL_INTERVAL);
    return () => clearInterval(poll);
  }, [fetchQueue]);

  // ── 4. Local Countdown Tick ──
  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (secondsLeft === null || secondsLeft <= 0) return;
    countdownRef.current = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [secondsLeft]);

  // ── Helpers ──
  const fmtTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const fmtCountdown = (secs) => {
    if (secs === null || secs <= 0) return '0m 00s';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  const sc = statusConfig[queue?.queueStatus] ?? statusConfig['On Schedule'];

  // User booking details
  const userServiceName = activeBooking?.serviceTitle || activeBooking?.service?.title || null;
  const userTechnician = activeBooking?.technicianName || activeBooking?.technician?.name || 'Your Assigned Artist';
  const userDate = activeBooking?.date || 'Today';
  const userSlot = activeBooking?.time || null;
  const userStatus = activeBooking?.status || 'Confirmed';

  // Check if currently serving matches the user
  const servingSlot = queue?.currentlyServingSlot || '12:30 PM';
  const isCurrentlyServingUser = Boolean(
    (userSlot && servingSlot && userSlot.trim().toLowerCase() === servingSlot.trim().toLowerCase()) ||
    userStatus === 'In-Service'
  );

  const totalInitialSecs = (queue?.estimatedWaitMinutes ?? 0) * 60;
  const progressPct = totalInitialSecs > 0
    ? Math.max(0, Math.min(1, 1 - (secondsLeft ?? 0) / totalInitialSecs))
    : 1;

  // SVG ring params
  const R = 54, CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - progressPct);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <RefreshCw size={36} className="text-[#8B5E3C] animate-spin" />
          <h2 className="font-serif text-2xl text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Connecting to Live Studio Queue...
          </h2>
          <p className="text-[#6B5344] text-sm">
            Fetching real-time technician station data from MongoDB Atlas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${queue?.queueEnabled ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${queue?.queueEnabled ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-widest ${queue?.queueEnabled ? 'text-emerald-700' : 'text-rose-700'}`}>
              {queue?.queueEnabled ? 'Live Salon Queue Active' : 'Live Queue Offline / Paused'}
            </span>
            {!online && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                <WifiOff size={11} /> Offline Cached
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Live Queue & Appointment Tracker
          </h1>
          <p className="text-xs text-[#6B5344] mt-1.5 flex items-center gap-1.5">
            <span>Auto-refreshes every 15s</span> • <span>Synced: {lastFetched ? fmtTime(lastFetched) : '—'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={fetchQueue}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs font-semibold text-[#2B1E16] hover:bg-[#FAF8F5] transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button 
            onClick={() => navigate('/account')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EDE5D8] rounded-xl text-xs font-semibold text-[#2B1E16] hover:bg-[#FAF8F5] transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={13} /> My Account
          </button>
        </div>
      </div>

      {/* ── Offline Banner ── */}
      {!online && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="shrink-0" />
          <span>Network connection interrupted. Displaying last synchronized queue state.</span>
        </div>
      )}

      {/* ── Active User In-Service Notification Banner ── */}
      {isCurrentlyServingUser && (
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-lg flex items-center justify-between gap-4 border border-emerald-600/40 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                It's Your Turn!
              </span>
              <h3 className="text-xl font-serif font-bold mt-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Your service is now underway at Station 01!
              </h3>
              <p className="text-xs text-white/80">
                Please take a seat with {userTechnician}. Relax and enjoy your treatment.
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Active Now
            </span>
          </div>
        </div>
      )}

      {/* ── Queue Disabled State ── */}
      {!queue?.queueEnabled && (
        <div className="bg-white border border-[#EDE5D8] rounded-3xl p-8 text-center shadow-sm mb-6 space-y-3">
          <AlertCircle size={36} className="text-amber-600 mx-auto" />
          <h3 className="font-serif text-xl text-[#2B1E16]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Live Queue Tracking is Currently Paused
          </h3>
          <p className="text-xs text-[#6B5344] max-w-md mx-auto leading-relaxed">
            The salon's real-time queue broadcasting is currently resting. Your confirmed booking is strictly reserved — please arrive at your scheduled time.
          </p>
          {userSlot && (
            <div className="inline-block mt-2 px-4 py-2 bg-[#FAF8F5] border border-[#EDE5D8] rounded-2xl text-xs font-semibold text-[#2B1E16]">
              Your Booked Session: {userSlot} • {userServiceName}
            </div>
          )}
        </div>
      )}

      {/* ── Main Dark Live Status Card ── */}
      {queue?.queueEnabled && (
        <div className="bg-gradient-to-br from-[#2B1E16] via-[#38271d] to-[#2B1E16] text-[#FAF8F5] rounded-3xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden border border-white/10">
          
          {/* Subtle Ambient Backdrops */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#d4956b]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Top Bar: Status Badge & Live Clock */}
            <div className="flex justify-between items-center pb-6 mb-6 border-b border-white/15 flex-wrap gap-3">
              <span 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}50` }}
              >
                <Radio size={12} className="animate-pulse" />
                Salon Pace: {queue.queueStatus}
              </span>

              <div className="flex items-center gap-2 text-xs text-white/70">
                <Clock size={14} />
                <span>Studio Local Time:</span>
                <span className="font-mono font-bold text-white text-sm bg-white/10 px-2 py-0.5 rounded-md">
                  {fmtTime(now)}
                </span>
              </div>
            </div>

            {/* 3 Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* 1. Currently Serving */}
              <div className="border-b md:border-b-0 md:border-r border-white/15 pb-5 md:pb-0 md:pr-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-200/80 mb-1">
                  Currently Serving
                </p>
                <h2 className="text-3xl font-serif font-bold text-white leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  {queue.currentlyServingSlot || '12:30 PM'}
                </h2>
                <p className="text-xs text-white/75 mt-1.5 leading-relaxed">
                  {queue.currentlyServingName ? (
                    <span>
                      <strong className="text-white">{queue.currentlyServingName}</strong>
                      {queue.currentlyServingService ? ` · ${queue.currentlyServingService}` : ''}
                    </span>
                  ) : (
                    'Technicians servicing ongoing clients'
                  )}
                </p>
                <span className="inline-block mt-2 text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/80">
                  Station 01 Active
                </span>
              </div>

              {/* 2. Wait Time Countdown Ring */}
              <div className="text-center py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/15 pb-5 md:pb-0 md:px-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-200/80 mb-2">
                  Estimated Wait Time
                </p>

                <div className="relative w-28 h-28 mx-auto mb-2">
                  <svg width="112" height="112" viewBox="0 0 120 120" className="-rotate-90">
                    <circle 
                      cx="60" cy="60" r={R} 
                      fill="none" 
                      stroke="rgba(255,255,255,0.12)" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="60" cy="60" r={R} 
                      fill="none" 
                      stroke="#d4956b" 
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-lg font-bold text-white leading-none">
                      {fmtCountdown(secondsLeft)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 mt-1">Remaining</span>
                  </div>
                </div>

                <p className="text-[11px] text-white/60">
                  Ticks live locally between pulses
                </p>
              </div>

              {/* 3. Your Appointment Status */}
              <div className="md:pl-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-200/80 mb-1">
                  Your Appointment
                </p>
                
                {userSlot ? (
                  <>
                    <h2 className="text-3xl font-serif font-bold text-white leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                      {userSlot}
                    </h2>
                    <p className="text-xs text-white/80 mt-1 font-medium">
                      {userServiceName || 'Reserved Service'}
                    </p>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      Stylist: {userTechnician} • {userDate}
                    </p>
                    <div className="mt-2.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isCurrentlyServingUser 
                          ? 'bg-emerald-400 text-emerald-950 font-black' 
                          : 'bg-white/15 text-white'
                      }`}>
                        {isCurrentlyServingUser ? '⭐ Now In Service' : '⏳ Up Next In Queue'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 py-1">
                    <p className="text-xs text-white/70">No booking active in this session.</p>
                    <Link 
                      to="/services" 
                      className="inline-block bg-[#d4956b] text-[#2B1E16] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#e6ab83] transition-colors"
                    >
                      Book a Service &rarr;
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Admin Broadcast Alert Box */}
            {queue.queueMessage && (
              <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/20 flex items-start gap-3 backdrop-blur-xs">
                <MessageSquare size={16} className="text-[#d4956b] shrink-0 mt-0.5" />
                <p className="text-xs text-white/90 leading-relaxed">
                  <strong className="text-white">Salon Notice:</strong> {queue.queueMessage}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Today's Queue Timeline ── */}
      <div className="bg-white border border-[#EDE5D8] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE1]">
          <div>
            <h3 className="text-xl font-serif text-[#2B1E16] font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Today's Station Timeline
            </h3>
            <p className="text-xs text-[#6B5344]">
              Real-time progress flow of salon treatments today
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Wifi size={12} /> Atlas Connected
          </span>
        </div>

        <div className="space-y-3">
          
          {/* 1. Prior Session (Completed) */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8]/70 text-xs">
            <div className="w-9 h-9 rounded-full bg-[#EAE4D8] text-[#6B5344] flex items-center justify-center shrink-0">
              <CheckCircle size={16} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#2B1E16] text-sm">Prior Appointment Block</p>
              <p className="text-[#6B5344]">Station sanitized and completed successfully</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5344] bg-[#EAE4D8] px-2.5 py-1 rounded-full">
              Completed
            </span>
          </div>

          {/* 2. Currently Active Slot */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 shadow-xs text-xs">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Radio size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2B1E16] text-sm">{servingSlot}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  Active Now
                </span>
              </div>
              <p className="text-[#6B5344] mt-0.5">
                {queue?.currentlyServingName ? (
                  <span>Currently servicing {queue.currentlyServingName} ({queue.currentlyServingService || 'Treatment'})</span>
                ) : (
                  'Station in session'
                )}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
              In-Service
            </span>
          </div>

          {/* 3. User's Booking Slot */}
          {userSlot && (
            <div className={`flex items-center gap-4 p-4 rounded-2xl text-xs transition-all ${
              isCurrentlyServingUser 
                ? 'bg-emerald-900 text-white shadow-md border border-emerald-700' 
                : 'bg-[#2B1E16] text-[#FAF8F5] shadow-md'
            }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                isCurrentlyServingUser ? 'bg-amber-400 text-emerald-950' : 'bg-[#FAF8F5] text-[#2B1E16]'
              }`}>
                YOU
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{userSlot}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isCurrentlyServingUser ? 'bg-amber-400 text-emerald-950' : 'bg-white/20 text-white'
                  }`}>
                    {isCurrentlyServingUser ? 'Now At Station' : 'Your Slot'}
                  </span>
                </div>
                <p className="text-white/80 mt-0.5">
                  {userServiceName || 'Reserved Service'} with {userTechnician}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                isCurrentlyServingUser ? 'bg-white text-emerald-950 font-extrabold' : 'bg-white/20 text-white'
              }`}>
                {isCurrentlyServingUser ? 'In-Progress' : 'Up Next'}
              </span>
            </div>
          )}

          {/* 4. Upcoming Slot */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE5D8]/70 text-xs">
            <div className="w-9 h-9 rounded-full bg-[#EAE4D8] text-[#6B5344] flex items-center justify-center shrink-0">
              <Timer size={16} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#2B1E16] text-sm">Subsequent Scheduled Sessions</p>
              <p className="text-[#6B5344]">Reserved client sessions following in the queue</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5344] bg-[#EAE4D8] px-2.5 py-1 rounded-full">
              Scheduled
            </span>
          </div>

        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-[#F0EBE1] flex items-start gap-2.5 text-xs text-[#6B5344] leading-relaxed">
          <ChevronRight size={15} className="shrink-0 text-[#2B1E16] mt-0.5" />
          <span>
            Queue updates are pushed dynamically from the salon's command center. The timer counts down live in seconds between synchronization pulses. If you arrive early, feel free to enjoy our complimentary espresso bar!
          </span>
        </div>
      </div>

    </div>
  );
};

export default LiveTracker;