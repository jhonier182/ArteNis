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
  // Sin header: la búsqueda ya está en la barra inferior
  return null;
}
