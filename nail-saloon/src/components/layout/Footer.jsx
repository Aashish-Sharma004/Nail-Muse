// src/components/layout/Footer.jsx


const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex space-x-6 mb-4">
          <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
          <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
          <a href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</a>
          <a href="/careers" className="text-sm text-gray-500 hover:text-gray-900">Careers</a>
        </div>
        <p className="text-xs text-gray-400">
          © 2026 NailMuse Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;