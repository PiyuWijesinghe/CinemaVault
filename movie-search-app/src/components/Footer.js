// src/components/Footer/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/95 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                CinemaVault
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Discover extraordinary films from around the universe. Your ultimate destination for movies, series, and entertainment content.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link to="/discover" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Discover Movies
              </Link>
              <Link to="/favorites" className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                <Heart className="w-4 h-4" />
                <span>My Favorites</span>
              </Link>
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Top Rated
              </a>
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                New Releases
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg mb-4">Categories</h4>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Action & Adventure
              </a>
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Science Fiction
              </a>
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Drama & Romance
              </a>
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Comedy
              </a>
              <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                Horror & Thriller
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>info@cinemavault.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-cyan-400 mt-1" />
                <span>123 Cinema Street<br />Los Angeles, CA 90210</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white font-medium mb-3">Subscribe to Newsletter</h5>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 text-sm"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">50M+</div>
              <div className="text-gray-400 text-sm">Movies & Shows</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">200+</div>
              <div className="text-gray-400 text-sm">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-1">4K</div>
              <div className="text-gray-400 text-sm">Ultra HD Quality</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} CinemaVault. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-110"
        title="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;