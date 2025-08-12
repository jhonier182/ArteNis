'use client';

import { useState } from 'react';
import { Search, Filter, Menu, Bell, User, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  searchValue: string;
}

export function SearchHeader({ onSearch, onFilterToggle, searchValue }: SearchHeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo estilo Instagram */}
          <h1 className="text-white text-xl font-bold tracking-tight">
            Artenis
          </h1>

          {/* Actions estilo Instagram */}
          <div className="flex items-center gap-4">
            <button className="text-white hover:opacity-50 transition-opacity">
              <Bell size={24} />
            </button>
            <button className="text-white hover:opacity-50 transition-opacity">
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
