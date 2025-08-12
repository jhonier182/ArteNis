'use client';

import { useState, useEffect } from 'react';
import { PinterestHeader } from '@/components/feed/PinterestHeader';
import { CompactMasonryGrid } from '@/components/feed/CompactMasonryGrid';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { mockTattooData, generateMoreTattoos } from '@/data/mockTattoos';
import { TattooPost } from '@/types/tattoo';

export function FeedScreen() {
  // Eliminado estado de conexión al backend
  const [searchQuery, setSearchQuery] = useState('');
  const [tattooData, setTattooData] = useState<TattooPost[]>(mockTattooData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [headerTab, setHeaderTab] = useState<'explore' | 'foryou'>('explore');

  useEffect(() => {}, []);

  // Funciones para manejar acciones de las cards
  const handleLike = (id: string) => {
    setTattooData(prevData => 
      prevData.map(tattoo => 
        tattoo.id === id 
          ? { 
              ...tattoo, 
              isLiked: !tattoo.isLiked,
              likes: tattoo.isLiked ? tattoo.likes - 1 : tattoo.likes + 1
            }
          : tattoo
      )
    );
  };

  const handleSave = (id: string) => {
    console.log('Saved tattoo:', id);
    // Aquí iría la lógica para guardar en boards
  };

  const handleShare = (id: string) => {
    console.log('Shared tattoo:', id);
    // Aquí iría la lógica para compartir
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Aquí iría la lógica de búsqueda real
  };

  const handleFilterToggle = () => {
    console.log('Toggle filters');
    // Aquí iría la lógica para mostrar filtros
  };

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setTimeout(() => {
      const newTattoos = generateMoreTattoos(tattooData.length + 1, 10);
      setTattooData(prev => [...prev, ...newTattoos]);
      setLoading(false);
      
      // Simular límite de datos
      if (tattooData.length > 50) {
        setHasMore(false);
      }
    }, 1000);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
    // Aquí iría la lógica para cambiar de pantalla
  };

  const handleHeaderTabChange = (tab: 'explore' | 'foryou') => {
    setHeaderTab(tab);
    console.log('Header tab changed to:', tab);
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
    // Aquí iría la lógica para mostrar búsqueda
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header estilo Pinterest */}
      <PinterestHeader
        activeTab={headerTab}
        onTabChange={handleHeaderTabChange}
        onSearchClick={handleSearchClick}
      />

      {/* Contenido principal */}
      <main className="pb-24">
        
        {/* Estado de conexión eliminado */}

        {/* Feed compacto tipo Instagram */}
        <CompactMasonryGrid
          posts={tattooData}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onLoadMore={handleLoadMore}
          loading={loading}
        />

        {/* Mensaje cuando no hay más contenido */}
        {!hasMore && (
          <div className="text-center py-8 max-w-md mx-auto">
            <p className="text-gray-400">¡Has visto todo el contenido disponible!</p>
            <p className="text-gray-500 text-sm mt-2">Vuelve más tarde para ver nuevo contenido</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

