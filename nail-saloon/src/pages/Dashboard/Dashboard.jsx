// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminOverview from '../../components/dashboard/AdminOverview';
import AppointmentsTable from '../../components/dashboard/AppointmentsTable';
import TechnicianRoster from '../../components/dashboard/TechnicianRoster';
import CustomerOverview from '../../components/dashboard/CustomerOverview';
import NewBookingModal from '../../components/dashboard/NewBookingModal';
import { 
  getAllBookings, 
  getBookingStats, 
  getUserBookings, 
  updateBookingStatus, 
  deleteBooking, 
  createBooking 
} from '../../services/api';

// Initial realistic luxury demo bookings if backend is empty or initializing
const DEFAULT_DEMO_BOOKINGS = [
  {
    _id: 'b-101',
    userEmail: 'sophia.v@gmail.com',
    serviceTitle: 'Signature Gel Manicure',
    technicianName: 'Elena M.',
    date: '2026-09-16',
    time: '11:00 AM',
    totalAmount: 65,
    status: 'In-Service',
    notes: 'Almond shape, chrome glaze top'
  },
  {
    _id: 'b-102',
    userEmail: 'claire.bennett@yahoo.com',
    serviceTitle: 'Luxury Spa Pedicure',
    technicianName: 'Mia K.',
    date: '2026-09-16',
    time: '12:30 PM',
    totalAmount: 75,
    status: 'Confirmed',
    notes: 'Lavender scrub massage'
  },
  {
    _id: 'b-103',
    userEmail: 'emma.taylor@gmail.com',
    serviceTitle: 'Custom Nail Art Set',
    technicianName: 'Sarah T.',
    date: '2026-09-16',
    time: '02:00 PM',
    totalAmount: 90,
    status: 'In-Service',
    notes: 'Airbrush aura with 3D crystal accents'
  },
  {
    _id: 'b-104',
    userEmail: 'harper.lee@outlook.com',
    serviceTitle: 'Gel-X Extensions',
    technicianName: 'Elena M.',
    date: '2026-09-16',
    time: '03:30 PM',
    totalAmount: 85,
    status: 'Confirmed',
    notes: 'Stiletto shape, nude base'
  },
  {
    _id: 'b-105',
    userEmail: 'isabella.rossi@gmail.com',
    serviceTitle: 'Japanese Organic Nail Care',
    technicianName: 'Chloe L.',
    date: '2026-09-16',
    time: '09:30 AM',
    totalAmount: 50,
    status: 'Completed',
    notes: 'Deep keratin cuticle nourishment'
  },
  {
    _id: 'b-106',
    userEmail: 'olivia.m@company.com',
    serviceTitle: 'Signature Gel Manicure',
    technicianName: 'Mia K.',
    date: '2026-09-15',
    time: '04:00 PM',
    totalAmount: 65,
    status: 'Completed',
    notes: 'Glazed donut chrome'
  },
  {
    _id: 'b-107',
    userEmail: 'maya.patel@gmail.com',
    serviceTitle: 'Express Polish & Shape',
    technicianName: 'Chloe L.',
    date: '2026-09-15',
    time: '02:30 PM',
    totalAmount: 35,
    status: 'Cancelled',
    notes: 'Client requested reschedule'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Current view perspective: 'admin' or 'customer'
  const initialMode = searchParams.get('view') === 'customer' ? 'customer' : 'admin';
  const [activeMode, setActiveMode] = useState(initialMode);
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, technicians, analytics

  const [bookings, setBookings] = useState(DEFAULT_DEMO_BOOKINGS);
  const [userBookings, setUserBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Read current user from localStorage
  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : { name: 'Valued Client', email: 'guest@nailmuse.com', loyaltyPoints: 450, tier: 'Gold VIP Member' };
    } catch {
      return { name: 'Valued Client', email: 'guest@nailmuse.com', loyaltyPoints: 450, tier: 'Gold VIP Member' };
    }
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try to fetch all bookings from backend
      const bookingsRes = await getAllBookings().catch(() => null);
      if (bookingsRes && bookingsRes.data && bookingsRes.data.length > 0) {
        setBookings(bookingsRes.data);
      } else {
        // Keep fallback data if backend is empty
        setBookings(DEFAULT_DEMO_BOOKINGS);
      }

      // 2. Try to fetch stats
      const statsRes = await getBookingStats().catch(() => null);
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      // 3. Try to fetch current user's bookings
      if (currentUser?.email) {
        const userRes = await getUserBookings(currentUser.email).catch(() => null);
        if (userRes && userRes.data && userRes.data.length > 0) {
          setUserBookings(userRes.data);
        } else {
          // Filter demo bookings matching or provide sample user bookings
          const matched = (bookingsRes?.data || DEFAULT_DEMO_BOOKINGS).filter(
            b => b.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
          );
          setUserBookings(matched.length > 0 ? matched : [DEFAULT_DEMO_BOOKINGS[0], DEFAULT_DEMO_BOOKINGS[4]]);
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, running in enhanced demo mode:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle status update
  const handleStatusChange = async (bookingId, newStatus) => {
    // 1. Optimistic UI update
    setBookings(prev => 
      prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
    );
    setUserBookings(prev =>
      prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
    );

    // 2. Backend update call
    try {
      await updateBookingStatus(bookingId, newStatus);
      showNotification(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.warn('Backend update failed, kept optimistic state:', err);
      showNotification(`Status updated locally to ${newStatus}`);
    }
  };

  // Handle delete / cancel
  const handleDeleteBooking = async (bookingId) => {
    setBookings(prev => prev.filter(b => b._id !== bookingId));
    setUserBookings(prev => prev.filter(b => b._id !== bookingId));

    try {
      await deleteBooking(bookingId);
      showNotification('Appointment removed successfully');
    } catch (err) {
      console.warn('Backend delete failed, removed locally:', err);
      showNotification('Appointment removed');
    }
  };

  // Handle new booking creation
  const handleCreateBooking = async (bookingPayload) => {
    const tempId = `b-${Date.now()}`;
    const newRecord = { ...bookingPayload, _id: tempId, status: 'Confirmed' };

    try {
      const res = await createBooking(bookingPayload);
      const saved = res.data?.booking || newRecord;
      setBookings(prev => [saved, ...prev]);
      if (saved.userEmail?.toLowerCase() === currentUser?.email?.toLowerCase()) {
        setUserBookings(prev => [saved, ...prev]);
      }
      showNotification('New appointment scheduled successfully!');
    } catch (err) {
      console.warn('Backend create error, saving locally:', err);
      setBookings(prev => [newRecord, ...prev]);
      showNotification('Appointment created!');
    }
  };

  // Switch perspective mode
  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
    setSearchParams({ view: mode });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2B1E16] text-[#FAF8F5] px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 text-xs font-medium animate-bounce">
          <span>✨</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Studio Dashboard Header */}
      <div className="border-b border-[#F0EBE1] bg-white/80 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1E16]">
                NailMuse Studio Dashboard
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#2B1E16] border border-[#F0EBE1]">
                Live Portal
              </span>
            </div>
            <p className="text-xs text-[#4A3B32] mt-0.5">
              Precision appointment scheduling, real-time salon operations, and client sanctuary
            </p>
          </div>

          {/* Perspective View Switcher & Quick Action */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Dual Mode Switcher Pill */}
            <div className="bg-[#FAF8F5] border border-[#F0EBE1] p-1 rounded-2xl flex items-center shadow-2xs">
              <button
                onClick={() => handleModeSwitch('admin')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'admin'
                    ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-sm'
                    : 'text-[#4A3B32] hover:text-[#2B1E16]'
                }`}
              >
                <span>💼</span> Salon Operations
              </button>
              <button
                onClick={() => handleModeSwitch('customer')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'customer'
                    ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-sm'
                    : 'text-[#4A3B32] hover:text-[#2B1E16]'
                }`}
              >
                <span>✨</span> Client Sanctuary
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2B1E16] text-[#FAF8F5] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#4A3B32] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Walk-in
            </button>
          </div>

        </div>

        {/* Tab Navigation for Admin Mode */}
        {activeMode === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-[#F0EBE1] pt-1">
            {[
              { id: 'overview', label: 'Studio Overview', icon: '📊' },
              { id: 'appointments', label: `Appointments (${bookings.length})`, icon: '📅' },
              { id: 'technicians', label: 'Technicians & Stations', icon: '💅' },
              { id: 'analytics', label: 'Salon Revenue & Insights', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#2B1E16] text-[#2B1E16] font-semibold'
                    : 'border-transparent text-[#4A3B32] hover:text-[#2B1E16] hover:border-[#F0EBE1]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#2B1E16] space-y-3">
            <div className="w-10 h-10 border-3 border-[#2B1E16] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-serif text-lg">Synchronizing salon sanctuary...</p>
          </div>
        ) : activeMode === 'admin' ? (
          
          /* Admin / Salon Operations View */
          <div>
            {activeTab === 'overview' && (
              <AdminOverview 
                stats={stats} 
                bookings={bookings} 
                onSelectTab={setActiveTab}
                onOpenNewBooking={() => setIsModalOpen(true)}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsTable 
                bookings={bookings}
                onStatusChange={handleStatusChange}
                onDeleteBooking={handleDeleteBooking}
                onOpenNewBooking={() => setIsModalOpen(true)}
              />
            )}

            {activeTab === 'technicians' && (
              <TechnicianRoster bookings={bookings} />
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-2xl font-serif text-[#2B1E16] font-semibold mb-1">
                    Salon Performance & Revenue Insights
                  </h3>
                  <p className="text-xs text-[#4A3B32] mb-8">
                    Detailed distribution of service categories, repeat clients, and staff utilization
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
                      <span className="text-[11px] uppercase font-bold text-[#4A3B32]">Repeat Client Rate</span>
                      <p className="text-3xl font-serif font-bold text-[#2B1E16] mt-1">78.4%</p>
                      <p className="text-[11px] text-emerald-700 mt-2">↑ 6% higher than industry benchmark</p>
                    </div>

                    <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
                      <span className="text-[11px] uppercase font-bold text-[#4A3B32]">Average Ticket Value</span>
                      <p className="text-3xl font-serif font-bold text-[#2B1E16] mt-1">$68.50</p>
                      <p className="text-[11px] text-[#4A3B32] mt-2">Driven by Gel-X and Add-on Nail Art</p>
                    </div>

                    <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1]">
                      <span className="text-[11px] uppercase font-bold text-[#4A3B32]">On-Time Appointment Rate</span>
                      <p className="text-3xl font-serif font-bold text-[#2B1E16] mt-1">96.2%</p>
                      <p className="text-[11px] text-emerald-700 mt-2">Average queue wait &lt; 4 minutes</p>
                    </div>
                  </div>

                  {/* Revenue by Service Table */}
                  <h4 className="font-serif text-lg text-[#2B1E16] font-semibold mb-4">Revenue Breakdown by Service</h4>
                  <div className="space-y-3">
                    {[
                      { service: 'Signature Gel Manicure', bookings: 24, revenue: '$1,560', pct: 42 },
                      { service: 'Luxury Spa Pedicure', bookings: 16, revenue: '$1,200', pct: 32 },
                      { service: 'Custom Nail Art Sets', bookings: 10, revenue: '$900', pct: 24 },
                      { service: 'Express Shaping & Polish', bookings: 8, revenue: '$280', pct: 8 }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1] flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <p className="font-serif font-medium text-sm text-[#2B1E16]">{item.service}</p>
                          <p className="text-[11px] text-[#4A3B32]">{item.bookings} appointments completed</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-32 bg-[#E5DFD4] h-2 rounded-full hidden sm:block overflow-hidden">
                            <div className="bg-[#2B1E16] h-full rounded-full" style={{ width: `${item.pct * 2}%` }}></div>
                          </div>
                          <span className="font-serif font-bold text-sm text-[#2B1E16]">{item.revenue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        ) : (

          /* Customer Sanctuary View */
          <CustomerOverview 
            user={currentUser} 
            userBookings={userBookings}
            onOpenNewBooking={() => setIsModalOpen(true)}
          />

        )}

      </main>

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBooking={handleCreateBooking}
      />

    </div>
  );
};

export default Dashboard;
