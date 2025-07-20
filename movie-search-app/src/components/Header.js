// src/components/Header/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-purple-900/95 backdrop-blur-md border-b border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            CinemaVault
          </h1>
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isActive('/') 
                ? 'text-cyan-300 bg-cyan-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Home
          </Link>
          
          <Link 
            to="/favorites" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isActive('/favorites') 
                ? 'text-cyan-300 bg-cyan-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:block">Favorites</span>
          </Link>
          
          <Link 
            to="/discover" 
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isActive('/discover') 
                ? 'text-cyan-300 bg-cyan-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Discover
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;