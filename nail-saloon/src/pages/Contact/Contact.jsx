// src/pages/Contact/Contact.jsx
import { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in text-[#2B1E16]">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-3">Get in Touch</h1>
        <p className="text-[#4A3B32]">Have questions or want to book a private event? Reach out to our team.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="bg-[#2B1E16] text-[#FAF8F5] rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-2xl font-serif mb-6">Studio Information</h2>
            
            <div className="space-y-6 text-sm text-[#FAF8F5]/90">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold text-white">Location</p>
                  <p>C-Scheme, Ashok Nagar, Jaipur, Rajasthan 301001</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+91 (987) 654-3210</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">✉️</span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>concierge@nailmusestudio.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <p className="font-semibold text-white">Working Hours</p>
                  <p>Mon - Sat: 9:00 AM - 7:00 PM<br/>Sunday: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#FAF8F5]/70">
            Complimentary valet parking available for all clients.
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-[#F0EBE1] rounded-3xl p-8 shadow-sm flex flex-col justify-center">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
              <h3 className="text-2xl font-serif mb-2">Message Sent!</h3>
              <p className="text-[#4A3B32]">Thank you for reaching out. We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-serif mb-2">Send a Message</h2>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Sarah Jenkins"
                  className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#2B1E16]" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="sarah@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#2B1E16]" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#4A3B32] mb-1">Message</label>
                <textarea 
                  rows="4" 
                  required 
                  placeholder="How can we help you?"
                  className="w-full bg-[#FAF8F5] border border-[#F0EBE1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#2B1E16]"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-[#2B1E16] text-[#FAF8F5] rounded-xl text-sm font-semibold hover:bg-[#4A3B32] transition-colors shadow-md"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;