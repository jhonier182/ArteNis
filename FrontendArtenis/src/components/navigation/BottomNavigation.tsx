'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Search, Plus, Grid3X3, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'create', icon: Plus, label: 'Create' },
  { id: 'boards', icon: Grid3X3, label: 'Boards' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const router = useRouter();
  const handleNav = (id: string) => {
    if (id === 'home') router.push('/');
    else if (id === 'profile') router.push('/profile');
    else onTabChange?.(id);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-md mx-auto">
        <nav className="flex items-center justify-around py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCreateButton = tab.id === 'create';

            if (isCreateButton) {
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className="flex flex-col items-center justify-center p-2"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                    <Plus size={24} className="text-white stroke-[2.5]" />
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className="flex flex-col items-center justify-center p-2 min-w-[60px]"
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex flex-col items-center">
                  <Icon 
                    size={28} 
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-primary-500' 
                        : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  
                  {/* Label */}
                  <span className={`text-xs mt-1 transition-colors duration-200 ${
                    isActive ? 'text-primary-500 font-semibold' : 'text-gray-400'
                  }`}>
                    {tab.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
