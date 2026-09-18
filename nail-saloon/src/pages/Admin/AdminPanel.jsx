// src/pages/Admin/AdminPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppointmentsTable from '../../components/dashboard/AppointmentsTable';
import ServicesManager from '../../components/admin/ServicesManager';
import AnnouncementEditor from '../../components/admin/AnnouncementEditor';
import ClientsManager from '../../components/admin/ClientsManager';
import QueueManager from '../../components/admin/QueueManager';
import OffersManager from '../../components/admin/OffersManager';
import TechniciansManager from '../../components/admin/TechniciansManager';
import NewBookingModal from '../../components/dashboard/NewBookingModal';
import {
  getAllBookings,
  getBookingStats,
  updateBookingStatus,
  deleteBooking,
  createBooking,
  getServices,
  createService,
  updateService,
  deleteService,
  getSalonSettings,
  updateSalonSettings,
  getAllUsers,
  updateUserLoyalty,
  getTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  toggleTechnicianAvailability
} from '../../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, loading: authLoading, logout } = useAuth();

  // Active section
  const [activeSection, setActiveSection] = useState('pulse'); // pulse, appointments, services, announcements, clients

  // Data states
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Toast
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedOfferClient, setSelectedOfferClient] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenOfferComposer = (email = '') => {
    setSelectedOfferClient(email);
    setActiveSection('offers');
  };

  // Fetch all administrative data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, statsRes, servicesRes, settingsRes, usersRes, techsRes] = await Promise.allSettled([
        getAllBookings(),
        getBookingStats(),
        getServices(),
        getSalonSettings(),
        getAllUsers(),
        getTechnicians()
      ]);

      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data || null);
      if (servicesRes.status === 'fulfilled') setServices(servicesRes.value.data || []);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data || null);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
      if (techsRes.status === 'fulfilled') setTechnicians(techsRes.value.data || []);
    } catch (err) {
      console.warn('Admin data fetch warning:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return; // Wait for initial session authentication check

    if (!isLoggedIn || !isAdmin) {
      alert('Access Restricted: The Admin Command Center is reserved for salon management. Please sign in with administrator credentials (admin123@gmail.com).');
      navigate('/login');
      return;
    }

    loadAllData();
  }, [authLoading, isLoggedIn, isAdmin, loadAllData, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Appointments handlers
  const handleStatusChange = async (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.data?.pointsAwarded && res.data.pointsAwarded > 0) {
        showToast(`✨ Service Completed! ${res.data.pointsAwarded} reward points automatically credited to ${res.data.user?.name || 'client'}.`);
        loadAllData(); // Reload customers list to reflect updated loyalty points & tier immediately!
      } else {
        showToast(`Appointment status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Status updated locally');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    setBookings(prev => prev.filter(b => b._id !== bookingId));
    try {
      await deleteBooking(bookingId);
      showToast('Appointment cancelled / removed');
    } catch (err) {
      console.error(err);
      showToast('Removed locally');
    }
  };

  const handleCreateBooking = async (payload) => {
    try {
      const res = await createBooking(payload);
      const saved = res.data?.booking || { ...payload, _id: `b-${Date.now()}`, status: 'Confirmed' };
      setBookings(prev => [saved, ...prev]);
      showToast('New walk-in appointment scheduled!');
    } catch (err) {
      console.error(err);
      showToast('Created booking');
    }
  };

  // Services handlers (Update web app live!)
  const handleAddService = async (serviceData) => {
    try {
      const res = await createService(serviceData);
      const created = res.data?.service;
      if (created) {
        setServices(prev => [created, ...prev]);
        showToast(`Service "${created.title}" added to salon catalog!`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create service');
    }
  };

  const handleUpdateService = async (id, serviceData) => {
    try {
      const res = await updateService(id, serviceData);
      const updated = res.data?.service || serviceData;
      setServices(prev => prev.map(s => (s._id === id || s.id === id) ? updated : s));
      showToast(`Service "${serviceData.title}" updated live!`);
    } catch (err) {
      console.error(err);
      alert('Failed to update service');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s._id !== id && s.id !== id));
      showToast('Service removed from catalog');
    } catch (err) {
      console.error(err);
      alert('Failed to delete service');
    }
  };

  // Settings handler (Update announcement banner live!)
  const handleSaveSettings = async (settingsData) => {
    const res = await updateSalonSettings(settingsData);
    setSettings(res.data?.settings || settingsData);
    showToast('Announcement and studio settings published live!');
  };

  // Clients handler (Update loyalty live!)
  const handleUpdateLoyalty = async (userId, loyaltyData) => {
    try {
      const res = await updateUserLoyalty(userId, loyaltyData);
      const updatedUser = res.data?.user;
      if (updatedUser) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...updatedUser } : u));
        showToast(`Client loyalty points and tier updated!`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update client loyalty');
    }
  };

  // Technicians handlers (Add, Edit, Remove, Duty Control)
  const handleAddTechnician = async (techData) => {
    try {
      const res = await createTechnician(techData);
      if (res.data) {
        setTechnicians(prev => [res.data, ...prev]);
        showToast(`Artist "${res.data.name}" added to salon roster!`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add technician');
    }
  };

  const handleUpdateTechnician = async (techId, techData) => {
    try {
      const res = await updateTechnician(techId, techData);
      if (res.data) {
        setTechnicians(prev => prev.map(t => (t._id === techId || t.id === techId) ? res.data : t));
        showToast(`Artist "${res.data.name}" updated successfully!`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update technician');
    }
  };

  const handleDeleteTechnician = async (techId) => {
    try {
      await deleteTechnician(techId);
      setTechnicians(prev => prev.filter(t => (t._id !== techId && t.id !== techId)));
      showToast('Artist removed from salon roster');
    } catch (err) {
      console.error(err);
      alert('Failed to delete technician');
    }
  };

  const handleToggleTechnicianAvailability = async (techId) => {
    try {
      const res = await toggleTechnicianAvailability(techId);
      if (res.data) {
        setTechnicians(prev => prev.map(t => (t._id === techId || t.id === techId) ? res.data : t));
        showToast(`Artist "${res.data.name}" is now ${res.data.available ? 'On Duty' : 'Off Duty'}`);
      }
    } catch (err) {
      console.error(err);
      // Optimistic update
      setTechnicians(prev => prev.map(t => (t._id === techId || t.id === techId) ? { ...t, available: !t.available } : t));
    }
  };

  // Navigation Items
  const navItems = [
    { id: 'pulse', label: 'Studio Pulse', icon: '📊', desc: 'KPIs & Revenue Overview' },
    { id: 'queue', label: 'Live Queue', icon: '📡', desc: 'Real-time queue control' },
    { id: 'appointments', label: `Appointments (${bookings.length})`, icon: '📅', desc: 'Manage salon visits' },
    { id: 'technicians', label: `Artist Roster (${technicians.length})`, icon: '👩‍🎨', desc: 'Manage nail artists & duty' },
    { id: 'services', label: `Services Catalog (${services.length})`, icon: '💅', desc: 'Add & edit treatments live' },
    { id: 'announcements', label: 'Site Announcements', icon: '📢', desc: 'Web app banner & promo code' },
    { id: 'offers', label: 'Email Offers & Blasts', icon: '💌', desc: 'Direct client email promos' },
    { id: 'clients', label: `VIP Clients (${users.length})`, icon: '👥', desc: 'Customer loyalty & tiers' }
  ];

  const totalRevenue = stats?.totalRevenue ?? bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const inServiceCount = stats?.statusCounts?.['In-Service'] ?? bookings.filter(b => b.status === 'In-Service').length;
  const confirmedCount = stats?.statusCounts?.Confirmed ?? bookings.filter(b => b.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-medium animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Command Header */}
      <header className="bg-white border-b border-[#F0EBE1] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-serif font-bold text-[#2B1E16] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2B1E16] text-white flex items-center justify-center text-xs font-serif">NM</span>
              NailMuse Command Center
            </Link>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Atlas Sync
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={loadAllData}
              className="text-xs text-[#4A3B32] hover:text-[#2B1E16] px-3 py-1.5 rounded-lg border border-[#F0EBE1] hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer"
              title="Refresh all data from MongoDB Atlas"
            >
              <span>↻</span> Refresh
            </button>

            <Link
              to="/services"
              target="_blank"
              className="text-xs text-[#4A3B32] hover:text-[#2B1E16] px-3 py-1.5 rounded-lg border border-[#F0EBE1] hover:bg-[#FAF8F5] flex items-center gap-1.5"
            >
              <span>↗</span> View Public Site
            </Link>

            <button
              onClick={() => setIsNewBookingOpen(true)}
              className="bg-[#2B1E16] text-[#FAF8F5] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#4A3B32] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Walk-in
            </button>

            <button
              onClick={handleLogout}
              className="text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-[#F0EBE1] hide-scrollbar">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${isActive
                    ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-sm'
                    : 'bg-white border border-[#F0EBE1] text-[#4A3B32] hover:border-[#2B1E16]'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Section Rendering */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#2B1E16] space-y-3">
            <div className="w-10 h-10 border-3 border-[#2B1E16] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-serif text-lg">Synchronizing Command Center with MongoDB Atlas...</p>
          </div>
        ) : (
          <div>

            {/* 1. Studio Pulse Overview */}
            {activeSection === 'pulse' && (
              <div className="space-y-8 animate-fade-in">

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
                    <p className="text-xs uppercase font-bold text-[#4A3B32] tracking-wider mb-1">Gross Salon Revenue</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2B1E16]">${totalRevenue.toLocaleString()}</h3>
                    <p className="text-[11px] text-emerald-700 mt-2 font-medium">↑ Real-time Atlas ledger</p>
                  </div>

                  <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
                    <p className="text-xs uppercase font-bold text-[#4A3B32] tracking-wider mb-1">Total Appointments</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2B1E16]">{bookings.length}</h3>
                    <p className="text-[11px] text-[#4A3B32] mt-2 font-medium">
                      {confirmedCount} Confirmed • {inServiceCount} In-Service
                    </p>
                  </div>

                  <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
                    <p className="text-xs uppercase font-bold text-[#4A3B32] tracking-wider mb-1">Catalog Treatments</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2B1E16]">{services.length}</h3>
                    <p className="text-[11px] text-emerald-700 mt-2 font-medium">
                      {services.filter(s => s.isAvailable !== false).length} Live on Website
                    </p>
                  </div>

                  <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
                    <p className="text-xs uppercase font-bold text-[#4A3B32] tracking-wider mb-1">Registered Clients</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2B1E16]">{users.length}</h3>
                    <p className="text-[11px] text-[#4A3B32] mt-2 font-medium">VIP Members Club</p>
                  </div>
                </div>

                {/* Quick Shortcuts & Live Web App Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Left 2 Cols: Priority Appointment Stream */}
                  <div className="lg:col-span-2 bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="font-serif text-xl font-semibold text-[#2B1E16]">Recent Booking Stream</h4>
                        <p className="text-xs text-[#4A3B32]">Live customer visits from MongoDB database</p>
                      </div>
                      <button
                        onClick={() => setActiveSection('appointments')}
                        className="text-xs font-semibold text-[#2B1E16] hover:underline underline-offset-4 cursor-pointer"
                      >
                        Manage All &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {bookings.slice(0, 4).map((b, idx) => (
                        <div key={b._id || idx} className="p-4 bg-[#FAF8F5] border border-[#F0EBE1] rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-serif font-semibold text-sm text-[#2B1E16]">{b.serviceTitle}</h5>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                {b.status || 'Confirmed'}
                              </span>
                            </div>
                            <p className="text-xs text-[#4A3B32] mt-0.5">
                              Client: <span className="font-medium text-[#2B1E16]">{b.userEmail}</span> • Artist: {b.technicianName}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-serif font-bold text-sm text-[#2B1E16]">${b.totalAmount}</span>
                            <select
                              value={b.status || 'Confirmed'}
                              onChange={(e) => handleStatusChange(b._id, e.target.value)}
                              className="bg-white border border-[#F0EBE1] rounded-lg px-2 py-1 text-xs text-[#2B1E16] cursor-pointer"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="In-Service">In-Service</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right 1 Col: Live Site Configuration Card */}
                  <div className="space-y-6">
                    {/* Queue Status Quick Card */}
                    <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-serif text-lg font-semibold text-[#2B1E16]">Live Queue</h4>
                        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${settings?.queueEnabled
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-gray-100 border border-gray-200 text-gray-600'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${settings?.queueEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`}></span>
                          {settings?.queueEnabled ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A3B32] mb-4">Real-time client tracker</p>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1]">
                          <span className="text-[10px] uppercase tracking-wider text-[#4A3B32] font-semibold block mb-1">Currently Serving:</span>
                          <p className="font-medium text-[#2B1E16]">
                            {settings?.currentlyServingSlot
                              ? `${settings.currentlyServingSlot}${settings.currentlyServingName ? ` · ${settings.currentlyServingName}` : ''}`
                              : 'Not set'}
                          </p>
                        </div>
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1]">
                          <span className="text-[10px] uppercase tracking-wider text-[#4A3B32] font-semibold block mb-1">Est. Wait / Status:</span>
                          <p className="font-bold text-[#2B1E16]">
                            {settings?.estimatedWaitMinutes ?? 0}m · {settings?.queueStatus ?? 'On Schedule'}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveSection('queue')}
                          className="w-full py-2.5 bg-[#2B1E16] text-[#FAF8F5] rounded-xl font-medium hover:bg-[#4A3B32] transition-colors cursor-pointer text-center block"
                        >
                          Manage Live Queue &rarr;
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 shadow-sm">
                      <h4 className="font-serif text-lg font-semibold text-[#2B1E16] mb-1">Web App Status</h4>
                      <p className="text-xs text-[#4A3B32] mb-4">Current public broadcast</p>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1]">
                          <span className="text-[10px] uppercase tracking-wider text-[#4A3B32] font-semibold block mb-1">Site Banner:</span>
                          <p className="font-medium text-[#2B1E16]">
                            {settings?.bannerActive ? `Active: "${settings.bannerText}"` : 'Disabled'}
                          </p>
                        </div>

                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1]">
                          <span className="text-[10px] uppercase tracking-wider text-[#4A3B32] font-semibold block mb-1">Active Promo Code:</span>
                          <p className="font-mono font-bold text-amber-800">
                            {settings?.promoCode || 'NONE'} ({settings?.discountPercent || 0}% OFF)
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveSection('announcements')}
                          className="w-full py-2.5 bg-[#2B1E16] text-[#FAF8F5] rounded-xl font-medium hover:bg-[#4A3B32] transition-colors cursor-pointer text-center block"
                        >
                          Configure Site Banner &rarr;
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#2B1E16] to-[#3d2a1e] text-[#FAF8F5] rounded-3xl p-6 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Email Marketing</span>
                      <h4 className="font-serif text-lg font-semibold text-white mt-1 mb-1">Direct Client Offers</h4>
                      <p className="text-xs text-white/75 mb-4">Send promo vouchers & custom email blasts directly to customers</p>
                      <button
                        onClick={() => handleOpenOfferComposer()}
                        className="w-full py-2.5 bg-amber-400 text-[#2B1E16] rounded-xl text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer text-center block shadow-md"
                      >
                        Compose Client Offer &rarr;
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. Live Queue Manager */}
            {activeSection === 'queue' && (
              <div className="animate-fade-in">
                <QueueManager
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  bookings={bookings}
                  onStatusChange={handleStatusChange}
                  showToast={showToast}
                />
              </div>
            )}

            {/* 3. Appointments Manager */}
            {activeSection === 'appointments' && (
              <AppointmentsTable
                bookings={bookings}
                onStatusChange={handleStatusChange}
                onDeleteBooking={handleDeleteBooking}
                onOpenNewBooking={() => setIsNewBookingOpen(true)}
              />
            )}

            {/* 3.5 Technicians & Artists Roster Manager */}
            {activeSection === 'technicians' && (
              <TechniciansManager
                technicians={technicians}
                onAddTechnician={handleAddTechnician}
                onUpdateTechnician={handleUpdateTechnician}
                onDeleteTechnician={handleDeleteTechnician}
                onToggleAvailability={handleToggleTechnicianAvailability}
              />
            )}

            {/* 4. Services Catalog & Pricing Editor */}
            {activeSection === 'services' && (
              <ServicesManager
                services={services}
                onAddService={handleAddService}
                onUpdateService={handleUpdateService}
                onDeleteService={handleDeleteService}
              />
            )}

            {/* 4. Announcements & Site Settings */}
            {activeSection === 'announcements' && (
              <AnnouncementEditor
                settings={settings}
                onSaveSettings={handleSaveSettings}
              />
            )}

            {/* 5. Direct Email Offers & Campaigns */}
            {activeSection === 'offers' && (
              <OffersManager
                users={users}
                initialTargetEmail={selectedOfferClient}
                showToast={showToast}
              />
            )}

            {/* 6. Clients & VIP Club */}
            {activeSection === 'clients' && (
              <ClientsManager
                users={users}
                onUpdateLoyalty={handleUpdateLoyalty}
                onSendOffer={handleOpenOfferComposer}
              />
            )}

          </div>
        )}

      </div>

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onCreateBooking={handleCreateBooking}
      />

    </div>
  );
};

export default AdminPanel;
