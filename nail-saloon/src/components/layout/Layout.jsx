// src/components/layout/Layout.jsx

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Navbar />
      
      {/* Dynamic Page Content */}
      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
