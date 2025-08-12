'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { TattooPost } from '@/types/tattoo';

interface CompactTattooCardProps extends TattooPost {
  onLike: (id: string) => void;
  onSave?: (id: string) => void;
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
  onSave,
  ...post
}: CompactTattooCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    onOpenDetail({ id, imageUrl, title, artist, likes, isLiked, tags, style, ...post });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden cursor-pointer mb-3"
      onClick={handleCardClick}
    >
      {/* Imagen principal sencilla */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto object-cover"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Artista en esquina superior izquierda */}
        <div
          className="absolute top-2 left-2 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            if (artist?.id) router.push(`/artist/${artist.id}`);
          }}
        >
          <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-black/40">
            {artist.avatar ? (
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">{artist.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <span className="text-white text-xs drop-shadow-sm">{artist.name}</span>
        </div>

        {/* Descripción y hashtags abajo izquierda */}
        <div className="absolute left-2 bottom-2 right-14">
          <h3 className="text-white text-sm font-semibold drop-shadow line-clamp-2">{title}</h3>
          {tags?.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.slice(0,3).map((t, idx)=>(
                <span key={idx} className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">#{t}</span>
              ))}
              {tags.length > 3 && (
                <span className="text-[10px] text-white/80">+{tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Acciones alineadas a la derecha */}
        <div className="absolute bottom-2 right-2 flex flex-col items-center gap-2" onClick={(e)=>e.stopPropagation()}>
          <button className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center" onClick={()=>onLike(id)}>
            <Heart size={18} className={isLiked ? 'text-accent-500 fill-current' : 'text-gray-700'} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center">
            <MessageCircle size={18} className="text-gray-700" />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
            onClick={() => {
              try {
                const shareUrl = `${window.location.origin}/post/${id}`;
                if (navigator.share) {
                  navigator.share({ title, text: title, url: shareUrl });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(shareUrl);
                }
              } catch (_) {
                // no-op
              }
            }}
          >
            <Send size={18} className="text-gray-700" />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
            onClick={() => onSave?.(id)}
          >
            <Bookmark size={18} className="text-gray-700" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
