// src/pages/Dashboard/Appointments.jsx
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const Appointments = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  // Past appointments list (mock data)
  const pastAppointments = [
    { id: 1, title: 'Classic Spa Pedicure', date: 'Sep 15, 2026', time: '11:00 AM', tech: 'Mia K.', status: 'Completed', price: '$65' },
    { id: 2, title: 'Custom Nail Art Set', date: 'Aug 02, 2026', time: '03:00 PM', tech: 'Elena M.', status: 'Completed', price: '$80' },
    { id: 3, title: 'Gel Removal & Care', date: 'Jul 10, 2026', time: '01:30 PM', tech: 'Sarah T.', status: 'Completed', price: '$25' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      
      {/* Header & Quick Book Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <button onClick={() => navigate('/account')} className="text-sm text-[#4A3B32] mb-3 hover:text-[#2B1E16] flex items-center gap-1">
            &larr; Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2B1E16]">My Appointments</h1>
          <p className="text-[#4A3B32]">Manage your upcoming visits and view complete service history.</p>
        </div>
        <button 
          onClick={() => navigate('/services')}
          className="bg-[#2B1E16] text-[#FAF8F5] px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#4A3B32] transition-all shadow-md flex items-center gap-2"
        >
          <span>+</span> Book New Session
        </button>
      </div>

      {/* Upcoming / Active Appointments Section */}
      <div className="mb-12">
        <h2 className="text-xl font-serif text-[#2B1E16] mb-4">Upcoming Appointment</h2>
        
        <div className="bg-white border border-[#F0EBE1] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full">
              Confirmed & Active
            </span>
            <h3 className="text-2xl font-serif text-[#2B1E16]">
              {bookingData.service?.title || 'Signature Gel Manicure'}
            </h3>
            <p className="text-sm text-[#4A3B32]">
              with <span className="font-semibold">{bookingData.technician?.name || 'Elena M.'}</span>
            </p>
            <div className="flex items-center gap-4 text-sm text-[#4A3B32] pt-2">
              <span className="flex items-center gap-1.5">📅 {bookingData.date || 'October 24, 2026'}</span>
              <span className="flex items-center gap-1.5">⏰ {bookingData.time || '2:30 PM'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/booking/tracker')}
              className="px-5 py-2.5 bg-[#2B1E16] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#4A3B32] text-center"
            >
              Track Live Queue 🕒
            </button>
            <button 
              onClick={() => navigate('/booking/date-time')}
              className="px-5 py-2.5 bg-white border border-[#F0EBE1] text-[#2B1E16] text-sm font-medium rounded-xl hover:bg-[#FAF8F5] text-center"
            >
              Reschedule
            </button>
          </div>
        </div>
      </div>

      {/* Past Appointments History */}
      <div>
        <h2 className="text-xl font-serif text-[#2B1E16] mb-4">Past Appointments History</h2>
        
        <div className="bg-white border border-[#F0EBE1] rounded-2xl overflow-hidden shadow-sm">
          {pastAppointments.map((item, index) => (
            <div key={item.id} className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${index !== pastAppointments.length - 1 ? 'border-b border-[#F0EBE1]' : ''} hover:bg-[#FAF8F5] transition-colors`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-serif text-lg text-[#2B1E16]">{item.title}</h4>
                  <span className="text-xs px-2.5 py-0.5 bg-green-50 text-green-700 font-semibold rounded-full border border-green-200">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-[#4A3B32]">
                  {item.date} at {item.time} • Technician: <span className="font-medium text-[#2B1E16]">{item.tech}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-serif font-medium text-lg text-[#2B1E16]">{item.price}</span>
                <button 
                  onClick={() => navigate('/services')}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#2B1E16] border border-[#2B1E16] rounded-lg hover:bg-[#2B1E16] hover:text-[#FAF8F5] transition-all"
                >
                  Book Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Appointments;