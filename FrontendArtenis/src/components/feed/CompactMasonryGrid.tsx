'use client';

import { useState, useEffect } from 'react';
import { CompactTattooCard } from './CompactTattooCard';
import { TattooDetailModal } from './TattooDetailModal';
import { TattooPost } from '@/types/tattoo';

interface CompactMasonryGridProps {
  posts: TattooPost[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onLoadMore?: () => void;
  loading?: boolean;
}

export function CompactMasonryGrid({ 
  posts, 
  onLike, 
  onSave, 
  onShare, 
  onLoadMore,
  loading = false 
}: CompactMasonryGridProps) {
  const [columns, setColumns] = useState(2);
  const [selectedPost, setSelectedPost] = useState<TattooPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pinterest masonry grid responsive
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 640) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        onLoadMore?.();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore]);

  const handleOpenDetail = (post: TattooPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Dividir posts en columnas para masonry
  const distributeIntoColumns = () => {
    const columnArrays: TattooPost[][] = Array.from({ length: columns }, () => []);
    
    posts.forEach((post, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(post);
    });
    
    return columnArrays;
  };

  const columnData = distributeIntoColumns();

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Masonry grid estilo Pinterest */}
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {columnData.map((columnPosts, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {columnPosts.map((post) => (
              <CompactTattooCard
                key={post.id}
                {...post}
                onLike={onLike}
                onSave={onSave}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      <TattooDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLike={onLike}
        onSave={onSave}
        onShare={onShare}
      />
    </div>
  );
}
