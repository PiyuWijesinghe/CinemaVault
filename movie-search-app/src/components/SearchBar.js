// src/components/SearchBar/SearchBar.js
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  defaultValue = "",
  autoFocus = false 
}) => {
  const [query, setQuery] = useState(defaultValue);

  // Update local state when defaultValue changes
  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${className}`}>
      <form onSubmit={handleSubmit} className="flex space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-cyan-400/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
          />
        </div>
        
        {/* Search Button */}
        <button 
          type="submit" 
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!query.trim()}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>
      
      {/* Search Suggestions */}
      {query.length > 0 && query.length < 3 && (
        <div className="mt-2 text-sm text-gray-400">
          Keep typing for better results...
        </div>
      )}
    </div>
  );
};

export default SearchBar;