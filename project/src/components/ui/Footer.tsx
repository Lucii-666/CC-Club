import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Circuitology Club</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering the next generation of electronics engineers through hands-on learning,
              innovative projects, and collaborative community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-white transition-colors duration-200">Component Catalog</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-white transition-colors duration-200">Projects</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors duration-200">Resources</Link></li>
              <li><Link to="/guidelines" className="text-gray-400 hover:text-white transition-colors duration-200">Guidelines</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-2">
              <p className="text-gray-400">Marwadi University</p>
              <p className="text-gray-400">Rajkot, Gujarat</p>
              <p className="text-gray-400">contact@circuitology.club</p>
              <p className="text-gray-400">+91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Circuitology Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;