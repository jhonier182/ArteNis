'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { TattooPost } from '@/types/tattoo';

interface CompactTattooCardProps extends TattooPost {
  onLike: (id: string) => void;
  onOpenDetail: (post: TattooPost) => void;
}

export function CompactTattooCard({ 
  id, 
  imageUrl, 
  title, 
  artist, 
  likes, 
  isLiked, 
  tags, 
  style,
  onLike, 
  onOpenDetail,
  ...post
}: CompactTattooCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    onOpenDetail({ id, imageUrl, title, artist, likes, isLiked, tags, style, ...post });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-gray-900 rounded-2xl overflow-hidden cursor-pointer shadow-lg mb-4 border border-gray-800"
      onClick={handleCardClick}
    >
      {/* Imagen principal - estilo Pinterest */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay con acciones (aparece en hover) */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="w-full p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(id);
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  {isLiked ? (
                    <Heart size={20} className="text-accent-500 fill-current" />
                  ) : (
                    <Heart size={20} className="text-gray-700" />
                  )}
                </button>
                
                <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <MessageCircle size={20} className="text-gray-700" />
                </button>
                
                <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Send size={20} className="text-gray-700" />
                </button>
              </div>
              
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Bookmark size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Badge de estilo en esquina superior */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
            {style}
          </span>
        </div>
      </div>

      {/* Footer con información */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Artist info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              {artist.avatar ? (
                <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-accent-500 to-primary-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-gray-300 text-xs font-medium">
              {artist.name}
              {artist.isVerified && (
                <span className="ml-1 text-primary-500">✓</span>
              )}
            </span>
          </div>

          <span className="text-gray-400 text-xs">
            {likes.toLocaleString()} ❤️
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-800 px-2 py-1 rounded-full text-xs text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
