'use client';

import { 
  Card as FlowbiteCard,
  Button,
  Badge
} from 'flowbite-react';
import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  imgSrc?: string;
  imgAlt?: string;
  horizontal?: boolean;
  href?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  className, 
  imgSrc, 
  imgAlt, 
  horizontal = false, 
  href,
  onClick 
}: CardProps) {
  return (
    <FlowbiteCard
      className={className}
      imgSrc={imgSrc}
      imgAlt={imgAlt}
      horizontal={horizontal}
      href={href}
      onClick={onClick}
    >
      {children}
    </FlowbiteCard>
  );
}

// Card específico para tatuajes/posts
export interface TattooCardProps {
  image: string;
  title: string;
  artist: {
    name: string;
    avatar?: string;
  };
  likes?: number;
  isLiked?: boolean;
  tags?: string[];
  onClick?: () => void;
  onLike?: () => void;
  onArtistClick?: () => void;
  className?: string;
}

export function TattooCard({
  image,
  title,
  artist,
  likes = 0,
  isLiked = false,
  tags = [],
  onClick,
  onLike,
  onArtistClick,
  className
}: TattooCardProps) {
  return (
    <Card className={`max-w-sm hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Imagen principal */}
      <div className="relative group cursor-pointer" onClick={onClick}>
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-t-lg">
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              color="light"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className={`!p-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>

        {/* Artista */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onArtistClick}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {artist.avatar ? (
              <img src={artist.avatar} alt={artist.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              artist.name.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {artist.name}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} color="purple" size="sm">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge color="gray" size="sm">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Estadísticas */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">{likes}</span>
          </div>
          
          <Button
            color="purple"
            size="xs"
            onClick={onClick}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Card para perfil de artista
export interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    followers?: number;
    posts?: number;
    rating?: number;
  };
  isFollowing?: boolean;
  onFollow?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

export function ArtistCard({
  artist,
  isFollowing = false,
  onFollow,
  onViewProfile,
  className
}: ArtistCardProps) {
  return (
    <Card className={`max-w-sm text-center ${className}`}>
      <div className="flex flex-col items-center pb-4">
        {/* Avatar */}
        <div className="w-24 h-24 mb-3 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 p-1">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            {artist.avatar ? (
              <img src={artist.avatar} alt={artist.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {artist.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Nombre */}
        <h3 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {artist.name}
        </h3>

        {/* Ubicación */}
        {artist.location && (
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            📍 {artist.location}
          </span>
        )}

        {/* Bio */}
        {artist.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {artist.bio}
          </p>
        )}

        {/* Estadísticas */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {artist.posts || 0}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {artist.followers || 0}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Seguidores</div>
          </div>
          {artist.rating && (
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">
                ⭐ {artist.rating.toFixed(1)}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Rating</div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 w-full">
          <Button
            color={isFollowing ? "gray" : "purple"}
            size="sm"
            onClick={onFollow}
            className="flex-1"
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </Button>
          <Button
            color="light"
            size="sm"
            onClick={onViewProfile}
            className="flex-1"
          >
            Ver Perfil
          </Button>
        </div>
      </div>
    </Card>
  );
}
