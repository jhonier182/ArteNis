'use client';

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface PinterestHeaderProps {
  activeTab: 'explore' | 'foryou';
  onTabChange: (tab: 'explore' | 'foryou') => void;
  onSearchClick: () => void;
}

export function PinterestHeader({ activeTab, onTabChange, onSearchClick }: PinterestHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="max-w-md mx-auto">
        {/* Top row con iconos */}
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 text-gray-300 hover:text-white transition-colors">
            <Bell size={24} />
          </button>
          
          <button 
            onClick={onSearchClick}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            <Search size={24} />
          </button>
        </div>

        {/* Tab selector - Explore / For you */}
        <div className="flex items-center justify-center pb-2">
          <div className="flex bg-gray-800 rounded-full p-1">
            <motion.button
              onClick={() => onTabChange('explore')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.button>
            
            <motion.button
              onClick={() => onTabChange('foryou')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'foryou'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              For you
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
