// src/components/admin/ClientsManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  Users, Sparkles, Crown, Search, ArrowUpDown, 
  Mail, Award, Calendar, DollarSign, CheckCircle2, ChevronRight
} from 'lucide-react';

const TIER_THRESHOLDS = [
  { name: 'Silver Member', min: 0, max: 299, color: 'text-slate-700 bg-slate-100 border-slate-300' },
  { name: 'Gold VIP Member', min: 300, max: 699, color: 'text-amber-900 bg-amber-50 border-amber-300' },
  { name: 'Platinum Elite Member', min: 700, max: 1199, color: 'text-indigo-900 bg-indigo-50 border-indigo-300' },
  { name: 'Diamond Sanctuary VIP', min: 1200, max: Infinity, color: 'text-purple-900 bg-purple-50 border-purple-300' }
];

const ClientsManager = ({ users = [], onUpdateLoyalty, onSendOffer }) => {
  const [activeSegment, setActiveSegment] = useState('all'); // 'all', 'new', 'vip'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'points', 'visits'
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsDelta, setPointsDelta] = useState(50);
  const [selectedTier, setSelectedTier] = useState('Gold VIP Member');

  // Customer Segmentation logic
  const isUserNew = (u) => {
    if (u.isNewCustomer !== undefined) return u.isNewCustomer;
    const daysOld = (Date.now() - new Date(u.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
    return daysOld <= 14 || (u.bookingCount || 0) <= 1;
  };

  const isUserVipOrRegular = (u) => {
    if (u.isVipOrRegular !== undefined) return u.isVipOrRegular;
    return (u.bookingCount || 0) >= 2 || (u.loyaltyPoints || 0) >= 500 || 
      (u.tier && (u.tier.includes('VIP') || u.tier.includes('Elite') || u.tier.includes('Diamond')));
  };

  // Group counts
  const newClients = useMemo(() => users.filter(isUserNew), [users]);
  const vipClients = useMemo(() => users.filter(isUserVipOrRegular), [users]);
  const totalPointsInCirculation = useMemo(() => 
    users.reduce((sum, u) => sum + (u.loyaltyPoints || 0), 0), 
    [users]
  );

  // Filter and sort clients
  const displayUsers = useMemo(() => {
    let list = users;
    
    // Segment filter
    if (activeSegment === 'new') {
      list = newClients;
    } else if (activeSegment === 'vip') {
      list = vipClients;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.tier && u.tier.toLowerCase().includes(q))
      );
    }

    // Sort order
    return [...list].sort((a, b) => {
      if (sortBy === 'points') {
        return (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0);
      }
      if (sortBy === 'visits') {
        return (b.bookingCount || 0) - (a.bookingCount || 0);
      }
      // default: newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [users, newClients, vipClients, activeSegment, searchTerm, sortBy]);

  const openAdjustModal = (user) => {
    setSelectedUser(user);
    setSelectedTier(user.tier || 'Gold VIP Member');
    setPointsDelta(50);
  };

  const handleSaveLoyalty = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const newPoints = Math.max(0, (selectedUser.loyaltyPoints || 0) + Number(pointsDelta));
    await onUpdateLoyalty(selectedUser._id, {
      loyaltyPoints: newPoints,
      tier: selectedTier
    });
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top 3 Segment KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: All Customers */}
        <div 
          onClick={() => setActiveSegment('all')}
          className={`bg-white border p-5 rounded-3xl cursor-pointer transition-all ${
            activeSegment === 'all' 
              ? 'border-[#2B1E16] shadow-md ring-1 ring-[#2B1E16]' 
              : 'border-[#F0EBE1] hover:border-[#2B1E16]/40 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#2B1E16] border border-[#F0EBE1] flex items-center justify-center">
              <Users size={18} />
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#4A3B32]">
              Total
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-[#2B1E16]">{users.length}</p>
          <p className="text-xs font-semibold text-[#2B1E16] mt-0.5">All Registered Clients</p>
          <p className="text-[10px] text-[#4A3B32]/70 mt-1">Complete salon customer database</p>
        </div>

        {/* Card 2: New Registered Customers */}
        <div 
          onClick={() => setActiveSegment('new')}
          className={`bg-white border p-5 rounded-3xl cursor-pointer transition-all relative overflow-hidden ${
            activeSegment === 'new' 
              ? 'border-emerald-600 shadow-md ring-1 ring-emerald-600' 
              : 'border-[#F0EBE1] hover:border-emerald-500/40 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Sparkles size={18} />
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
              New Joiners
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-emerald-900">{newClients.length}</p>
          <p className="text-xs font-semibold text-emerald-950 mt-0.5">New Registered Clients</p>
          <p className="text-[10px] text-emerald-800/80 mt-1">First-time visitors & recent signups</p>
        </div>

        {/* Card 3: VIP & Regular Customers */}
        <div 
          onClick={() => setActiveSegment('vip')}
          className={`bg-white border p-5 rounded-3xl cursor-pointer transition-all relative overflow-hidden ${
            activeSegment === 'vip' 
              ? 'border-amber-600 shadow-md ring-1 ring-amber-600' 
              : 'border-[#F0EBE1] hover:border-amber-500/40 hover:shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
              <Crown size={18} />
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              VIP Tier
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-amber-950">{vipClients.length}</p>
          <p className="text-xs font-semibold text-amber-950 mt-0.5">Older VIP & Regular Clients</p>
          <p className="text-[10px] text-amber-900/80 mt-1">Repeat visits & high loyalty tier</p>
        </div>

        {/* Card 4: Total Loyalty Points */}
        <div className="bg-white border border-[#F0EBE1] p-5 rounded-3xl">
          <div className="flex justify-between items-center mb-2">
            <span className="w-10 h-10 rounded-2xl bg-[#F5EFE6] text-[#2B1E16] border border-[#E8DCC8] flex items-center justify-center">
              <Award size={18} />
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Auto-Earn Active
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-[#2B1E16]">{totalPointsInCirculation.toLocaleString()}</p>
          <p className="text-xs font-semibold text-[#2B1E16] mt-0.5">Total Points in Circulation</p>
          <p className="text-[10px] text-[#4A3B32]/70 mt-1">+1 pt per $1 on service completion</p>
        </div>

      </div>

      {/* Segment Filter Toolbar & Search Bar */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Segment Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => setActiveSegment('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeSegment === 'all'
                  ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A3B32] border border-[#F0EBE1] hover:bg-[#F0EBE1]'
              }`}
            >
              <span>👥 All Customers</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveSegment('new')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeSegment === 'new'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>✨ New Registered Customers</span>
              <span className="bg-emerald-900/20 px-2 py-0.5 rounded-full text-[10px] font-bold">{newClients.length}</span>
            </button>

            <button
              onClick={() => setActiveSegment('vip')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeSegment === 'vip'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>👑 Older VIP & Regular Patrons</span>
              <span className="bg-amber-900/20 px-2 py-0.5 rounded-full text-[10px] font-bold">{vipClients.length}</span>
            </button>
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A3B32]/50" />
              <input
                type="text"
                placeholder="Search name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
              />
            </div>

            {/* Sort order */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-[#4A3B32]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF8F5] border border-[#F0EBE1] text-[#2B1E16] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#2B1E16] cursor-pointer font-medium"
              >
                <option value="newest">Newest Members</option>
                <option value="visits">Most Visits</option>
                <option value="points">Highest Points</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F0EBE1] text-[11px] uppercase tracking-wider text-[#4A3B32] font-semibold bg-[#FAF8F5]/80">
                <th className="py-4 px-5">Customer & Category</th>
                <th className="py-4 px-4">Contact Info</th>
                <th className="py-4 px-4">Visits & Completion</th>
                <th className="py-4 px-4">Loyalty Reward Points</th>
                <th className="py-4 px-4">Current Tier</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {displayUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#4A3B32]">
                    <p className="font-serif text-lg text-[#2B1E16] mb-1">No customers match this filter</p>
                    <p className="text-xs">Try switching between "All Customers", "New Registered", or clearing search terms.</p>
                  </td>
                </tr>
              ) : (
                displayUsers.map(user => {
                  const isNew = isUserNew(user);
                  const isVip = isUserVipOrRegular(user);
                  const completedVisits = user.completedBookings ?? 0;
                  const totalVisits = user.bookingCount ?? 0;
                  const points = user.loyaltyPoints ?? 450;

                  return (
                    <tr 
                      key={user._id} 
                      className={`hover:bg-[#FAF8F5] transition-colors ${
                        isNew ? 'bg-emerald-50/15' : ''
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-2xs ${
                            isNew 
                              ? 'bg-emerald-800 text-emerald-50' 
                              : isVip 
                              ? 'bg-amber-900 text-amber-50' 
                              : 'bg-[#2B1E16] text-[#FAF8F5]'
                          }`}>
                            {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NM'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-serif font-bold text-[#2B1E16] text-sm">
                                {user.name || 'Valued Member'}
                              </p>

                              {/* Segmentation Badge */}
                              {isNew ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                  <Sparkles size={10} />
                                  New Member
                                </span>
                              ) : isVip ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                                  <Crown size={10} />
                                  VIP Regular
                                </span>
                              ) : (
                                <span className="bg-[#FAF8F5] text-[#4A3B32] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#F0EBE1]">
                                  Regular Guest
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#4A3B32]/70 mt-0.5">
                              Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {user.daysSinceJoined !== undefined && (
                                <span className="ml-1 text-[10px]">({user.daysSinceJoined === 0 ? 'Today' : `${user.daysSinceJoined}d ago`})</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4 text-[#4A3B32]">
                        <span className="font-mono text-xs text-[#2B1E16]">{user.email}</span>
                        {user.role === 'admin' && (
                          <span className="ml-2 text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">ADMIN</span>
                        )}
                      </td>

                      {/* Visits & Completion */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#2B1E16] text-xs">
                            {totalVisits} Total {totalVisits === 1 ? 'Visit' : 'Visits'}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                            <CheckCircle2 size={12} />
                            <span>{completedVisits} Completed</span>
                          </div>
                        </div>
                      </td>

                      {/* Reward Points */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs inline-block">
                            {points} Pts
                          </span>
                          <p className="text-[10px] text-[#4A3B32]/70">Auto-credited on completed treatments</p>
                        </div>
                      </td>

                      {/* Current Tier */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#2B1E16] border border-[#E8DCC8]">
                          👑 {user.tier || 'Gold VIP Member'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onSendOffer && (
                            <button
                              onClick={() => onSendOffer(user.email)}
                              className="text-xs bg-[#FAF8F5] border border-[#EDE5D8] hover:border-[#2B1E16] text-[#2B1E16] px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              title={`Send personalized offer to ${user.email}`}
                            >
                              <Mail size={13} />
                              <span>Offer</span>
                            </button>
                          )}

                          <button
                            onClick={() => openAdjustModal(user)}
                            className="text-xs bg-[#2B1E16] text-[#FAF8F5] px-3 py-1.5 rounded-xl font-medium hover:bg-[#4A3B32] transition-colors shadow-2xs cursor-pointer"
                          >
                            Adjust Perks
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Loyalty Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE1]">
              <div>
                <h3 className="text-xl font-serif text-[#2B1E16] font-bold">Adjust Client Rewards</h3>
                <p className="text-xs text-[#4A3B32]">
                  Manual points & tier override for <strong className="text-[#2B1E16]">{selectedUser.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#4A3B32] hover:text-[#2B1E16] flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLoyalty} className="space-y-4 text-xs">
              
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1] flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#4A3B32] block">Current Points Balance</span>
                  <span className="text-lg font-serif font-bold text-[#2B1E16]">{selectedUser.loyaltyPoints || 450} Pts</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#4A3B32] block">Current VIP Tier</span>
                  <span className="font-semibold text-xs text-amber-900">{selectedUser.tier || 'Gold VIP Member'}</span>
                </div>
              </div>

              {/* Quick Preset Deltas */}
              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1.5">Quick Point Adjustments</label>
                <div className="flex gap-2">
                  {[+50, +100, +250, -50].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPointsDelta(amt)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer flex-1 transition-all ${
                        pointsDelta === amt 
                          ? 'bg-[#2B1E16] text-white border-[#2B1E16] shadow-xs' 
                          : 'bg-[#FAF8F5] border-[#F0EBE1] text-[#4A3B32] hover:bg-[#F0EBE1]'
                      }`}
                    >
                      {amt > 0 ? `+${amt}` : amt} Pts
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Delta Input */}
              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">Custom Adjustment (+ / -)</label>
                <input
                  type="number"
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
                <p className="text-[11px] text-[#4A3B32] mt-1.5 font-medium">
                  Updated points will become: <strong className="text-[#2B1E16] font-bold">{Math.max(0, (selectedUser.loyaltyPoints || 450) + Number(pointsDelta))} Pts</strong>
                </p>
              </div>

              {/* Membership Tier Select */}
              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">VIP Membership Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer font-medium"
                >
                  <option value="Silver Member">Silver Member (0 - 299 Pts)</option>
                  <option value="Gold VIP Member">Gold VIP Member (300 - 699 Pts)</option>
                  <option value="Platinum Elite Member">Platinum Elite Member (700 - 1199 Pts)</option>
                  <option value="Diamond Sanctuary VIP">Diamond Sanctuary VIP (1200+ Pts)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#4A3B32] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2B1E16] text-[#FAF8F5] font-semibold text-xs rounded-xl hover:bg-[#4A3B32] transition-colors shadow-sm cursor-pointer"
                >
                  Apply & Save Rewards
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientsManager;
