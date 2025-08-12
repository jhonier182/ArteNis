'use client';

import { useState, useEffect, useRef } from 'react';
import { TattooCard } from './TattooCard';
import { TattooPost } from '@/types/tattoo';

interface MasonryGridProps {
  posts: TattooPost[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onLoadMore?: () => void;
  loading?: boolean;
}

export function MasonryGrid({ 
  posts, 
  onLike, 
  onSave, 
  onShare, 
  onLoadMore,
  loading = false 
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full">
      <div ref={gridRef} className="max-w-screen-2xl mx-auto px-4 lg:px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 [column-fill:_balance]">
          {posts.map((post) => (
            <div key={post.id} className="mb-4 break-inside-avoid">
              <TattooCard
                id={post.id}
                imageUrl={post.imageUrl}
                title={post.title}
                artist={post.artist}
                likes={post.likes}
                isLiked={post.isLiked}
                tags={post.tags}
                style={post.style}
                onLike={onLike}
                onSave={onSave}
                onShare={onShare}
              />
            </div>
          ))}
        </div>
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
    </div>
  );
}
