// src/pages/Booking/SelectDateTime.jsx
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const SelectDateTime = () => {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  
  // Real calendar data for August 2026
  const currentYear = 2026;
  const currentMonth = "August";
  const today = 22;

  // Actual August 2026 calendar structure
  // 0 means blank space (days from previous/next month)
  const calendarGrid = [
    [0, 0, 0, 0, 0, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 0, 0, 0, 0, 0, 0]
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Time slots grouped by time of day
  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['12:00 PM', '01:00 PM', '02:00 PM', '03:30 PM', '04:00 PM'];
  const eveningSlots = ['05:00 PM', '05:30 PM', '06:30 PM'];

  const handleNext = () => {
    if (bookingData.date && bookingData.time) navigate('/booking/review');
  };

  const isDateDisabled = (day) => {
    // Disable past dates, or day 0 (blanks)
    return day === 0 || day < today; 
  };

  const getFullDateString = (day) => `${currentMonth} ${day}, ${currentYear}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm font-medium text-[#4A3B32] mb-6 hover:text-[#2B1E16] flex items-center justify-center md:justify-start gap-2 mx-auto md:mx-0 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Technicians
        </button>
        <h2 className="text-3xl md:text-4xl font-serif text-[#2B1E16] mb-3">
          Select Date & Time
        </h2>
        <p className="text-[#4A3B32] text-lg max-w-2xl mx-auto md:mx-0">
          Scheduling <span className="font-semibold text-[#2B1E16]">{bookingData.service?.title}</span> with <span className="font-semibold text-[#2B1E16]">{bookingData.technician?.name.split(' ')[0] || 'your technician'}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Interactive Calendar */}
        <div className="lg:col-span-5 h-fit">
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <button className="p-2 text-[#4A3B32] hover:bg-[#FAF8F5] rounded-full transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <h3 className="text-xl font-serif text-[#2B1E16] font-medium tracking-wide">
                {currentMonth} {currentYear}
              </h3>
              <button className="p-2 text-[#4A3B32] hover:bg-[#FAF8F5] rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#4A3B32]/60 uppercase tracking-wider mb-4">
              {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>

            {/* Calendar Grid */}
            <div className="grid gap-1 mb-6">
              {calendarGrid.map((week, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, colIndex) => {
                    const isDisabled = isDateDisabled(day);
                    const isSelected = bookingData.date === getFullDateString(day);
                    const isToday = day === today;

                    return (
                      <div key={colIndex} className="aspect-square flex items-center justify-center">
                        {day !== 0 && (
                          <button 
                            disabled={isDisabled}
                            onClick={() => updateBooking({ date: getFullDateString(day), time: null })} // Reset time when date changes
                            className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium transition-all
                              ${isSelected ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-md transform scale-105' : ''}
                              ${!isSelected && !isDisabled ? 'hover:bg-[#FAF8F5] text-[#2B1E16] hover:border hover:border-[#F0EBE1]' : ''}
                              ${isDisabled && !isToday ? 'text-gray-300 cursor-not-allowed' : ''}
                              ${isToday && !isSelected ? 'text-[#2B1E16] bg-[#FAF8F5] border border-[#2B1E16]/20' : ''}
                            `}
                          >
                            {day}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#4A3B32]/80 bg-[#FAF8F5] p-3 rounded-xl border border-[#F0EBE1]">
              <svg className="w-4 h-4 shrink-0 text-[#2B1E16]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Appointments available up to 30 days in advance.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Time Selection & Confirmation */}
        <div className="lg:col-span-7 flex flex-col">
          
          <div className="bg-white border border-[#F0EBE1] rounded-3xl p-6 md:p-8 shadow-sm flex-grow">
            {!bookingData.date ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#4A3B32]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-serif text-[#2B1E16] mb-2">Select a Date</h3>
                <p className="text-[#4A3B32]">Please choose a date from the calendar to view available time slots.</p>
              </div>
            ) : (
              <div className="animate-fade-in space-y-8">
                <div className="flex justify-between items-center border-b border-[#F0EBE1] pb-4">
                  <h3 className="text-xl font-serif text-[#2B1E16]">Available Slots</h3>
                  <span className="text-sm font-semibold text-[#4A3B32] bg-[#FAF8F5] px-3 py-1 rounded-full">{bookingData.date}</span>
                </div>

                {/* Morning Slots */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-[#4A3B32]/70 mb-4">
                    <span className="text-xl">☀️</span> Morning
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {morningSlots.map(time => (
                      <button 
                        key={time}
                        onClick={() => updateBooking({ time })}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200 
                          ${bookingData.time === time 
                            ? 'bg-[#2B1E16] text-[#FAF8F5] border-[#2B1E16] shadow-md ring-2 ring-[#2B1E16] ring-offset-2 ring-offset-white' 
                            : 'bg-white border-[#F0EBE1] text-[#2B1E16] hover:border-[#2B1E16] hover:bg-[#FAF8F5]'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Afternoon Slots */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-[#4A3B32]/70 mb-4">
                    <span className="text-xl">🌤️</span> Afternoon
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {afternoonSlots.map(time => (
                      <button 
                        key={time}
                        onClick={() => updateBooking({ time })}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200 
                          ${bookingData.time === time 
                            ? 'bg-[#2B1E16] text-[#FAF8F5] border-[#2B1E16] shadow-md ring-2 ring-[#2B1E16] ring-offset-2 ring-offset-white' 
                            : 'bg-white border-[#F0EBE1] text-[#2B1E16] hover:border-[#2B1E16] hover:bg-[#FAF8F5]'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evening Slots */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-[#4A3B32]/70 mb-4">
                    <span className="text-xl">🌙</span> Evening
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {eveningSlots.map(time => (
                      <button 
                        key={time}
                        onClick={() => updateBooking({ time })}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200 
                          ${bookingData.time === time 
                            ? 'bg-[#2B1E16] text-[#FAF8F5] border-[#2B1E16] shadow-md ring-2 ring-[#2B1E16] ring-offset-2 ring-offset-white' 
                            : 'bg-white border-[#F0EBE1] text-[#2B1E16] hover:border-[#2B1E16] hover:bg-[#FAF8F5]'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Action Button area (Sticks to bottom of column on desktop) */}
          <div className="mt-6">
            <button 
              onClick={handleNext}
              disabled={!bookingData.date || !bookingData.time}
              className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2
                ${bookingData.date && bookingData.time 
                  ? 'bg-[#2B1E16] text-[#FAF8F5] shadow-[0_8px_30px_rgb(43,30,22,0.2)] hover:bg-[#4A3B32] hover:-translate-y-1' 
                  : 'bg-[#F0EBE1] text-[#4A3B32]/50 cursor-not-allowed'}`}
            >
              Review Appointment Details
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectDateTime;