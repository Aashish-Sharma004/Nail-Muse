// src/components/admin/ClientsManager.jsx
import React, { useState } from 'react';

const ClientsManager = ({ users, onUpdateLoyalty }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsDelta, setPointsDelta] = useState(50);
  const [selectedTier, setSelectedTier] = useState('Gold VIP Member');

  const filtered = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
        <div>
          <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold">Registered Clients & Loyalty Roster</h3>
          <p className="text-xs text-[#4A3B32] mt-0.5">
            Manage membership tiers, reward client points, and monitor patron activity
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#4A3B32]/60">🔍</span>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-xs text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-[#F0EBE1] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F0EBE1] text-[11px] uppercase tracking-wider text-[#4A3B32] font-semibold bg-[#FAF8F5]/60">
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Rewards Points</th>
                <th className="py-3.5 px-4">VIP Tier</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#4A3B32]">
                    <p className="font-serif text-base text-[#2B1E16] mb-1">No clients found</p>
                    <p className="text-xs">No registered customer accounts match your query.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user._id} className="hover:bg-[#FAF8F5]/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2B1E16] text-[#FAF8F5] flex items-center justify-center font-serif text-xs font-bold shrink-0">
                          {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-[#2B1E16] text-sm">{user.name || 'Member'}</p>
                          <p className="text-[11px] text-[#4A3B32]/70">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#4A3B32]">
                      <span className="font-mono text-xs">{user.email}</span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#2B1E16]">
                      {user.bookingCount ?? 1} visits
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs">
                        {user.loyaltyPoints ?? 450} Pts
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#2B1E16] border border-[#F0EBE1]">
                        👑 {user.tier || 'Gold VIP Member'}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => openAdjustModal(user)}
                        className="text-xs bg-[#2B1E16] text-[#FAF8F5] px-3 py-1.5 rounded-lg font-medium hover:bg-[#4A3B32] transition-colors shadow-2xs cursor-pointer"
                      >
                        Adjust Perks
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Loyalty Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute right-6 top-6 text-[#4A3B32] hover:text-[#2B1E16] text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold mb-1">
              Adjust Client Rewards
            </h3>
            <p className="text-xs text-[#4A3B32] mb-6">
              Update points and VIP tier for <strong className="text-[#2B1E16]">{selectedUser.name}</strong> ({selectedUser.email})
            </p>

            <form onSubmit={handleSaveLoyalty} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">Current Points: {selectedUser.loyaltyPoints || 450} Pts</label>
                <div className="flex gap-2">
                  {[+50, +100, +250, -50].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPointsDelta(amt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        pointsDelta === amt 
                          ? 'bg-[#2B1E16] text-white border-[#2B1E16]' 
                          : 'bg-[#FAF8F5] border-[#F0EBE1] text-[#4A3B32]'
                      }`}
                    >
                      {amt > 0 ? `+${amt}` : amt} Pts
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">Points Delta Adjustment</label>
                <input
                  type="number"
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16]"
                />
                <p className="text-[10px] text-[#4A3B32] mt-1">
                  New point total will be: <strong>{Math.max(0, (selectedUser.loyaltyPoints || 450) + Number(pointsDelta))} Pts</strong>
                </p>
              </div>

              <div>
                <label className="block text-[#4A3B32] font-semibold mb-1">VIP Membership Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl text-[#2B1E16] focus:outline-none focus:border-[#2B1E16] cursor-pointer"
                >
                  <option value="Silver Member">Silver Member</option>
                  <option value="Gold VIP Member">Gold VIP Member</option>
                  <option value="Platinum VIP Club">Platinum VIP Club</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#F0EBE1] text-[#4A3B32] font-medium hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2B1E16] text-[#FAF8F5] font-semibold rounded-xl hover:bg-[#4A3B32] transition-colors shadow-sm cursor-pointer"
                >
                  Save Rewards
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
