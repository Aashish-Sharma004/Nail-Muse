// src/components/admin/SupportInbox.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAdminConvos, getAdminThread, sendAdminReply, resolveConversation, deleteConversation } from '../../services/api';

// ── Format helpers ────────────────────────────────────────────────────────────
function fmtTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function fmtFull(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Render markdown-ish text ──────────────────────────────────────────────────
function renderText(txt) {
  const parts = txt.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
    const lm = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lm) return <a key={i} href={lm[2]} className="underline text-amber-700">{lm[1]}</a>;
    return p.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
    ));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
const SupportInbox = ({ showToast }) => {
  const [conversations, setConversations] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [thread, setThread] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'resolved'

  const messagesEndRef = useRef(null);
  const replyRef = useRef(null);
  const pollRef = useRef(null);

  // ── Load conversation list ──────────────────────────────────────────────
  const loadConvos = useCallback(async () => {
    try {
      const res = await getAdminConvos();
      setConversations(res.data || []);
    } catch {
      showToast?.('Failed to load conversations');
    } finally {
      setLoadingConvos(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadConvos();
    pollRef.current = setInterval(loadConvos, 12000); // poll every 12s
    return () => clearInterval(pollRef.current);
  }, [loadConvos]);

  // ── Load thread ─────────────────────────────────────────────────────────
  const loadThread = useCallback(async (sessionId) => {
    setLoadingThread(true);
    try {
      const res = await getAdminThread(sessionId);
      setThread(res.data || []);
      // update unread count in list
      setConversations(prev =>
        prev.map(c => c._id === sessionId ? { ...c, unreadCount: 0 } : c)
      );
    } catch {
      showToast?.('Failed to load thread');
    } finally {
      setLoadingThread(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeSessionId) {
      loadThread(activeSessionId);
    }
  }, [activeSessionId, loadThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  // ── Send reply ──────────────────────────────────────────────────────────
  const handleReply = async () => {
    if (!replyText.trim() || !activeSessionId || isSending) return;
    setIsSending(true);
    try {
      const res = await sendAdminReply({ sessionId: activeSessionId, text: replyText.trim() });
      setThread(prev => [...prev, res.data]);
      setReplyText('');
      setConversations(prev =>
        prev.map(c => c._id === activeSessionId
          ? { ...c, lastMessage: replyText.trim(), lastSender: 'admin', lastAt: new Date().toISOString() }
          : c
        )
      );
      showToast?.('Reply sent!');
    } catch {
      showToast?.('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }
  };

  // ── Resolve / Reopen ────────────────────────────────────────────────────
  const handleResolve = async (sessionId, resolved) => {
    try {
      await resolveConversation(sessionId, resolved);
      setConversations(prev => prev.map(c => c._id === sessionId ? { ...c, resolved } : c));
      if (activeSessionId === sessionId) {
        setThread(prev => prev.map(m => ({ ...m, resolved })));
      }
      showToast?.(resolved ? 'Conversation resolved ✅' : 'Conversation reopened');
    } catch {
      showToast?.('Action failed');
    }
  };

  // ── Delete conversation ─────────────────────────────────────────────────
  const handleDelete = async (sessionId) => {
    if (!confirm('Delete this entire conversation? This cannot be undone.')) return;
    try {
      await deleteConversation(sessionId);
      setConversations(prev => prev.filter(c => c._id !== sessionId));
      if (activeSessionId === sessionId) { setActiveSessionId(null); setThread([]); }
      showToast?.('Conversation deleted');
    } catch {
      showToast?.('Delete failed');
    }
  };

  // ── Filtered conversations ──────────────────────────────────────────────
  const filtered = conversations.filter(c => {
    if (filter === 'open') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  const totalUnread = conversations.reduce((s, c) => s + (c.unreadCount || 0), 0);
  const activeConvo = conversations.find(c => c._id === activeSessionId);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[500px]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B1E16] flex items-center gap-2">
            💬 Support Inbox
            {totalUnread > 0 && (
              <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">{totalUnread} new</span>
            )}
          </h2>
          <p className="text-xs text-[#4A3B32] mt-0.5">Client messages &amp; live chat conversations</p>
        </div>
        <button
          onClick={loadConvos}
          className="text-xs text-[#4A3B32] hover:text-[#2B1E16] px-3 py-1.5 rounded-lg border border-[#F0EBE1] hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Body: Sidebar + Thread ─────────────────────────────────────── */}
      <div className="flex flex-1 gap-4 overflow-hidden min-h-0">

        {/* ── Sidebar: Conversation List ──────────────────────────────── */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-white border border-[#F0EBE1] rounded-2xl overflow-hidden">

          {/* Filter tabs */}
          <div className="flex gap-1 p-2 border-b border-[#F0EBE1]">
            {['all', 'open', 'resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer
                            ${filter === f ? 'bg-[#2B1E16] text-white' : 'text-[#4A3B32] hover:bg-[#FAF8F5]'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {loadingConvos ? (
              <div className="flex items-center justify-center h-32 text-[#4A3B32] text-xs">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <span className="text-3xl">✉️</span>
                <p className="text-xs text-[#4A3B32]">No conversations yet</p>
              </div>
            ) : (
              filtered.map(convo => (
                <button
                  key={convo._id}
                  onClick={() => setActiveSessionId(convo._id)}
                  className={`w-full text-left p-3.5 border-b border-[#F9F5F0] transition-all cursor-pointer
                              ${activeSessionId === convo._id ? 'bg-[#FAF8F5] border-l-2 border-l-[#2B1E16]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
                                      ${convo.resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-[#2B1E16] text-white'}`}>
                        {convo.resolved ? '✓' : (convo.senderName?.[0] || '?').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#2B1E16] truncate">
                          {convo.senderName || 'Guest'}
                        </p>
                        {convo.senderEmail && (
                          <p className="text-[10px] text-[#9a8a7e] truncate">{convo.senderEmail}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] text-[#9a8a7e]">{fmtTime(convo.lastAt)}</span>
                      {convo.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B5B4E] mt-1.5 truncate leading-relaxed pl-10">
                    {convo.lastSender === 'admin' ? '↪ You: ' : convo.lastSender === 'bot' ? '🤖 ' : ''}
                    {convo.lastMessage}
                  </p>
                  {convo.resolved && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-10">
                      ✓ Resolved
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Thread Panel ───────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white border border-[#F0EBE1] rounded-2xl overflow-hidden min-w-0">
          {!activeSessionId ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#4A3B32]">
              <span className="text-5xl">💬</span>
              <p className="font-serif text-lg font-semibold text-[#2B1E16]">Select a Conversation</p>
              <p className="text-xs max-w-xs text-center">Choose a conversation from the left to view messages and reply to clients</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0EBE1] flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#2B1E16] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(activeConvo?.senderName?.[0] || '?').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#2B1E16] truncate">{activeConvo?.senderName || 'Guest'}</p>
                    {activeConvo?.senderEmail && (
                      <p className="text-[11px] text-[#9a8a7e] truncate">{activeConvo.senderEmail}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {activeConvo?.resolved ? (
                    <button
                      onClick={() => handleResolve(activeSessionId, false)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-all cursor-pointer"
                    >
                      ↩ Reopen
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResolve(activeSessionId, true)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                    >
                      ✓ Resolve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(activeSessionId)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 hide-scrollbar"
                   style={{ background: 'linear-gradient(180deg, #FFFDF9 0%, #FAF8F5 100%)' }}>
                {loadingThread ? (
                  <div className="flex items-center justify-center h-32 text-[#4A3B32] text-xs">Loading thread...</div>
                ) : thread.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-[#4A3B32] text-xs">No messages yet</div>
                ) : (
                  thread.map(msg => (
                    <AdminMessageRow key={msg._id} msg={msg} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              {activeConvo?.resolved ? (
                <div className="px-5 py-4 border-t border-[#F0EBE1] bg-emerald-50 text-center flex-shrink-0">
                  <p className="text-xs text-emerald-700 font-medium">
                    ✅ This conversation is resolved. &nbsp;
                    <button onClick={() => handleResolve(activeSessionId, false)}
                            className="underline hover:no-underline cursor-pointer">
                      Reopen to reply
                    </button>
                  </p>
                </div>
              ) : (
                <div className="px-4 pb-4 pt-2 border-t border-[#F0EBE1] flex-shrink-0 bg-white">
                  <div className="flex items-end gap-2 bg-[#FAF8F5] border border-[#E0D5C8] rounded-2xl px-3 py-2 focus-within:border-[#2B1E16] transition-colors">
                    <textarea
                      ref={replyRef}
                      id="admin-reply-input"
                      rows={1}
                      value={replyText}
                      onChange={e => {
                        setReplyText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your reply... (Enter to send, Shift+Enter for newline)"
                      className="flex-1 resize-none bg-transparent text-sm text-[#2B1E16] placeholder-[#B0A090] outline-none leading-5"
                      style={{ maxHeight: '120px', minHeight: '24px' }}
                      disabled={isSending}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || isSending}
                      id="admin-send-reply-btn"
                      className="px-4 py-2 rounded-xl bg-[#2B1E16] text-white text-xs font-semibold
                                 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A3B32]
                                 transition-all duration-200 flex-shrink-0 cursor-pointer"
                    >
                      {isSending ? '...' : 'Send ↗'}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#B0A090] mt-1.5 px-1">
                    Replying as <span className="font-semibold text-[#4A3B32]">NailMuse Team</span> · Client will see this in their chat widget
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Admin thread message row ──────────────────────────────────────────────────
function AdminMessageRow({ msg }) {
  const isAdmin = msg.sender === 'admin';
  const isBot   = msg.sender === 'bot';

  const bubbleStyle = isAdmin
    ? 'bg-[#2B1E16] text-white rounded-2xl rounded-br-sm ml-auto shadow-md'
    : isBot
    ? 'bg-amber-50 border border-amber-200 text-[#2B1E16] rounded-2xl rounded-bl-sm shadow-sm'
    : 'bg-white border border-[#F0EBE1] text-[#2B1E16] rounded-2xl rounded-bl-sm shadow-sm';

  return (
    <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${bubbleStyle}`}>
        {renderText(msg.text)}
      </div>
      <span className="text-[10px] text-[#9a8a7e] mt-0.5 px-1">
        {isAdmin ? '👩‍💼 You (NailMuse Team)' : isBot ? '🤖 Bot Reply' : `👤 ${msg.senderName || 'Client'}`}
        {' · '}
        {fmtFull(msg.createdAt)}
      </span>
    </div>
  );
}

export default SupportInbox;
