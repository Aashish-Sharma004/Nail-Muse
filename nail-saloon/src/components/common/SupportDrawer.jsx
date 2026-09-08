// src/components/common/SupportDrawer.jsx
import { useState } from 'react';

const SupportDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Support Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#2B1E16] text-[#FAF8F5] p-4 rounded-full shadow-2xl hover:bg-[#4A3B32] transition-all flex items-center justify-center gap-2 group"
      >
        <span className="text-xl">💬</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-medium">Need Help?</span>
      </button>

      {/* Drawer Overlay & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#2B1E16]/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#F0EBE1]">
            
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#F0EBE1]">
                <h2 className="text-2xl font-serif text-[#2B1E16]">NailMuse Support</h2>
                <button onClick={() => setIsOpen(false)} className="text-[#4A3B32] font-bold text-lg">✕</button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#F0EBE1]">
                  <h4 className="font-medium text-sm text-[#2B1E16] mb-1">Frequently Asked Questions</h4>
                  <p className="text-xs text-[#4A3B32]">• What is the cancellation policy?<br/>• Can I bring inspiration photos?<br/>• How long does Gel-X last?</p>
                </div>
              </div>

              <h3 className="font-serif text-lg text-[#2B1E16] mb-3">Send us a message</h3>
              {sent ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center text-sm font-medium">
                  Message sent! Our concierge will reply shortly.
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-4">
                  <textarea 
                    rows="4" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your question here..." 
                    className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#2B1E16]"
                    required
                  ></textarea>
                  <button type="submit" className="w-full py-3 bg-[#2B1E16] text-[#FAF8F5] rounded-xl text-sm font-medium hover:bg-[#4A3B32]">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="text-center text-xs text-[#4A3B32]/70 pt-4 border-t border-[#F0EBE1]">
              Studio Hours: Mon-Sat (9:00 AM - 7:00 PM)
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportDrawer;