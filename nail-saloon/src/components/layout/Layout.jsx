// src/components/layout/Layout.jsx

import AnnouncementBanner from './AnnouncementBanner';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <AnnouncementBanner />
      <Navbar />
      
      {/* Dynamic Page Content */}
      <main className="grow w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
