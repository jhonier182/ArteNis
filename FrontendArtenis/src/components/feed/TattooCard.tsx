'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { TattooPost } from '@/types/tattoo';

interface TattooCardProps extends TattooPost {
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

export function TattooCard({ 
  id, 
  imageUrl, 
  title, 
  artist, 
  likes, 
  isLiked, 
  tags, 
  style,
  onLike, 
  onSave, 
  onShare 
}: TattooCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-dark-900 rounded-2xl overflow-hidden border border-dark-700/50 hover:border-primary-500/30 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen Principal */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Acciones rápidas (aparecen en hover) */}
        <motion.div 
          className="absolute top-3 right-3 flex flex-col gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(id);
            }}
            className="w-8 h-8 bg-dark-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-dark-600/50 hover:bg-primary-500/20 hover:border-primary-500/50 transition-all duration-200"
          >
            <Bookmark size={14} className="text-white" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(id);
            }}
            className="w-8 h-8 bg-dark-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-dark-600/50 hover:bg-accent-500/20 hover:border-accent-500/50 transition-all duration-200"
          >
            <Share2 size={14} className="text-white" />
          </button>
          
          <button className="w-8 h-8 bg-dark-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-dark-600/50 hover:bg-dark-600 transition-all duration-200">
            <MoreHorizontal size={14} className="text-white" />
          </button>
        </motion.div>

        {/* Badge de estilo */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary-500/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-primary-300 border border-primary-500/30">
            {style}
          </span>
        </div>
      </div>

      {/* Información del tattoo */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
          {title}
        </h3>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-dark-800 px-2 py-1 rounded-full text-xs text-dark-300 border border-dark-700"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-dark-400">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Información del artista */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              {artist.avatar ? (
                <img src={artist.avatar} alt={artist.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">
                  {artist.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-dark-300 font-medium">
                {artist.name}
                {artist.isVerified && (
                  <span className="ml-1 text-primary-400">✓</span>
                )}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(id);
              }}
              className={`flex items-center gap-1 transition-all duration-200 ${
                isLiked 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-dark-400 hover:text-red-400'
              }`}
            >
              <Heart 
                size={14} 
                className={isLiked ? 'fill-current' : ''} 
              />
              <span className="text-xs font-medium">{likes}</span>
            </button>
            
            <button className="flex items-center gap-1 text-dark-400 hover:text-primary-400 transition-colors duration-200">
              <MessageCircle size={14} />
              <span className="text-xs font-medium">12</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
