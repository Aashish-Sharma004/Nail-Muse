// src/components/common/SupportDrawer.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage, getChatSession } from '../../services/api';

// ── Stable session ID (persisted in sessionStorage per browser tab) ──────────
function getOrCreateSessionId() {
  let id = sessionStorage.getItem('nm_chat_session');
  if (!id) {
    id = `nm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('nm_chat_session', id);
  }
  return id;
}

// ── Quick-action FAQ chips ───────────────────────────────────────────────────
const FAQ_CHIPS = [
  { label: '📅 Booking', text: 'How do I book an appointment?' },
  { label: '❌ Cancellation', text: 'What is your cancellation policy?' },
  { label: '💰 Pricing', text: 'What are your prices?' },
  { label: '🕐 Hours', text: 'What are your opening hours?' },
  { label: '💅 Gel-X', text: 'How long does Gel-X last?' },
  { label: '🏆 Loyalty', text: 'How does the loyalty rewards program work?' },
];

// ── Format timestamp ─────────────────────────────────────────────────────────
function fmtTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Render markdown-ish bold (**text**) simply ───────────────────────────────
function renderText(txt) {
  const parts = txt.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} className="underline text-amber-700 hover:text-amber-900">{linkMatch[1]}</a>;
    }
    return p.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
    ));
  });
}

// ── Main Component ───────────────────────────────────────────────────────────
const SupportDrawer = () => {
  const { user } = useAuth();
  const sessionId = useRef(getOrCreateSessionId()).current;

  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [unread, setUnread]       = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const pollRef        = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isBotTyping, scrollToBottom]);

  // ── Poll for admin replies every 10s while open ──────────────────────────
  const fetchMessages = useCallback(async () => {
    try {
      const res = await getChatSession(sessionId);
      const fetched = res.data || [];
      setMessages(prev => {
        const prevIds = new Set(prev.map(m => m._id));
        const newAdminMsgs = fetched.filter(m => m.sender === 'admin' && !prevIds.has(m._id));
        if (newAdminMsgs.length > 0 && !isOpen) {
          setUnread(u => u + newAdminMsgs.length);
        }
        return fetched;
      });
    } catch { /* silent */ }
  }, [sessionId, isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      pollRef.current = setInterval(fetchMessages, 10000);
    }
    return () => clearInterval(pollRef.current);
  }, [messages.length, fetchMessages]);

  const openChat = async () => {
    setIsOpen(true);
    setUnread(0);
    if (messages.length === 0) {
      await fetchMessages();
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? inputText).trim();
    if (!text || isSending) return;

    const name  = user?.name  || guestName  || 'Guest';
    const email = user?.email || guestEmail || '';

    const tempId = `tmp_${Date.now()}`;
    const optimistic = { _id: tempId, sender: 'user', text, senderName: name, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    setInputText('');
    setIsSending(true);
    setShowIntro(false);

    try {
      const res = await sendChatMessage({ sessionId, senderName: name, senderEmail: email, text });
      const { userMessage, botMessage } = res.data;

      setMessages(prev => prev.map(m => m._id === tempId ? userMessage : m));

      if (botMessage) {
        setIsBotTyping(true);
        await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
        setIsBotTyping(false);
        setMessages(prev => [...prev, botMessage]);
      } else {
        setMessages(prev => {
          const hasEscalation = prev.some(m => m._id === 'escalation');
          if (hasEscalation) return prev;
          return [...prev, {
            _id: 'escalation',
            sender: 'bot',
            text: `🙋 Our concierge team has received your message and will reply shortly! In the meantime, check our [Services](/services) page or call us during studio hours. 💕`,
            senderName: 'NailMuse Assistant',
            createdAt: new Date().toISOString(),
          }];
        });
      }
    } catch {
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChip = (text) => {
    setShowIntro(false);
    handleSend(text);
  };

  const needsGuestForm = !user && !guestName;

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <button
        id="chat-trigger-btn"
        onClick={openChat}
        aria-label="Open support chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          minWidth: '56px',
        }}
        className="group flex items-center gap-0 hover:gap-2 overflow-hidden
                   bg-[#2B1E16] text-[#FAF8F5] p-4 rounded-full shadow-2xl 
                   hover:bg-[#3d2a1e] transition-all duration-300 ease-in-out
                   hover:pr-5 hover:rounded-2xl"
      >
        <span className="text-xl leading-none flex-shrink-0">💬</span>
        <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 ease-in-out">
          Need Help?
        </span>
        {unread > 0 && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px' }}
                className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* ── Chat Panel ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            zIndex: 50,
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
          }}
        >
          {/* Panel */}
          <div
            style={{
              height: 'min(580px, 85vh)',
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF8F5 100%)',
              animation: 'chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            className="w-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8E0D5]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0EBE1] flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #2B1E16 0%, #3d2a1e 100%)' }}>
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-lg shadow-md flex-shrink-0">
                💅
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">NailMuse Support</p>
                <span className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 text-[11px]">Online · Replies in minutes</span>
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all flex-shrink-0 cursor-pointer"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Guest Name Form */}
            {needsGuestForm ? (
              <GuestForm onSubmit={(name, email) => { setGuestName(name); setGuestEmail(email); }} />
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 hide-scrollbar">

                  {/* Welcome bubble */}
                  <div className="flex gap-2.5 items-end">
                    <BotAvatar />
                    <div className="max-w-[82%]">
                      <Bubble sender="bot">
                        👋 Hi {user?.name || guestName}! I&apos;m your NailMuse assistant. Ask me anything, or pick a quick topic below!
                      </Bubble>
                      <span className="text-[10px] text-[#9a8a7e] mt-1 block ml-1">🤖 Assistant · Just now</span>
                    </div>
                  </div>

                  {/* FAQ chips */}
                  {showIntro && messages.length === 0 && (
                    <div className="flex flex-wrap gap-2 pl-10 pb-1">
                      {FAQ_CHIPS.map(chip => (
                        <button
                          key={chip.label}
                          onClick={() => handleChip(chip.text)}
                          className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#D4C5B5] bg-white text-[#4A3B32] hover:bg-[#2B1E16] hover:text-white hover:border-[#2B1E16] transition-all duration-200 shadow-sm cursor-pointer"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message list */}
                  {messages.map((msg) => (
                    <MessageRow key={msg._id} msg={msg} />
                  ))}

                  {/* Bot typing indicator */}
                  {isBotTyping && (
                    <div className="flex gap-2.5 items-end">
                      <BotAvatar />
                      <div className="bg-white border border-[#F0EBE1] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                        <TypingDots />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 pb-4 pt-2 border-t border-[#F0EBE1] bg-white/60 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-end gap-2 bg-white border border-[#E0D5C8] rounded-2xl shadow-sm px-3 py-2 focus-within:border-[#2B1E16] transition-colors">
                    <textarea
                      ref={inputRef}
                      id="chat-input"
                      rows={1}
                      value={inputText}
                      onChange={e => {
                        setInputText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about bookings, services..."
                      className="flex-1 resize-none bg-transparent text-sm text-[#2B1E16] placeholder-[#B0A090] outline-none leading-5"
                      style={{ maxHeight: '96px', minHeight: '24px' }}
                      disabled={isSending}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputText.trim() || isSending}
                      id="chat-send-btn"
                      className="w-8 h-8 rounded-xl bg-[#2B1E16] text-white flex items-center justify-center flex-shrink-0
                                 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A3B32]
                                 transition-all duration-200 active:scale-95 cursor-pointer"
                      aria-label="Send message"
                    >
                      {isSending
                        ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <SendIcon />}
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-[#B0A090] mt-2">
                    Studio hours: Mon–Sat 9AM–7PM · Sun 10AM–5PM
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────

function GuestForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-5">
      <div className="text-4xl">💌</div>
      <div className="text-center">
        <h3 className="font-serif text-lg font-bold text-[#2B1E16] mb-1">Welcome!</h3>
        <p className="text-xs text-[#6B5B4E]">Just tell us who you are and we&apos;ll get you connected.</p>
      </div>
      <div className="w-full space-y-3">
        <input
          id="guest-name-input"
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onSubmit(name.trim(), email.trim())}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C8] text-sm text-[#2B1E16] placeholder-[#B0A090] focus:outline-none focus:border-[#2B1E16] bg-white"
        />
        <input
          id="guest-email-input"
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onSubmit(name.trim(), email.trim())}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5C8] text-sm text-[#2B1E16] placeholder-[#B0A090] focus:outline-none focus:border-[#2B1E16] bg-white"
        />
        <button
          id="guest-start-chat-btn"
          onClick={() => { if (name.trim()) onSubmit(name.trim(), email.trim()); }}
          disabled={!name.trim()}
          className="w-full py-3 bg-[#2B1E16] text-white text-sm font-semibold rounded-xl
                     hover:bg-[#4A3B32] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Start Chatting →
        </button>
      </div>
    </div>
  );
}

function MessageRow({ msg }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex gap-2.5 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <BotAvatar isAdmin={msg.sender === 'admin'} />}
      <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <Bubble sender={msg.sender}>
          {renderText(msg.text)}
        </Bubble>
        <span className={`text-[10px] text-[#9a8a7e] mt-0.5 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {msg.sender === 'admin' ? '👩‍💼 NailMuse Team' : msg.sender === 'bot' ? '🤖 Assistant' : 'You'} · {fmtTime(msg.createdAt)}
        </span>
      </div>
    </div>
  );
}

function Bubble({ sender, children }) {
  const styles = {
    user:  'bg-[#2B1E16] text-white rounded-2xl rounded-br-sm shadow-md',
    bot:   'bg-white border border-[#F0EBE1] text-[#2B1E16] rounded-2xl rounded-bl-sm shadow-sm',
    admin: 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-[#2B1E16] rounded-2xl rounded-bl-sm shadow-sm',
  };
  return (
    <div className={`px-4 py-2.5 text-sm leading-relaxed ${styles[sender] || styles.bot}`}>
      {children}
    </div>
  );
}

function BotAvatar({ isAdmin }) {
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm
                    ${isAdmin ? 'bg-amber-400' : 'bg-[#2B1E16]'}`}>
      {isAdmin ? '👩‍💼' : '💅'}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-4">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#C8A98A]"
          style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default SupportDrawer;