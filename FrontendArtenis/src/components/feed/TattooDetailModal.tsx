'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Send,
  MoreHorizontal,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';
import { TattooPost } from '@/types/tattoo';

interface TattooDetailModalProps {
  post: TattooPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

export function TattooDetailModal({ 
  post, 
  isOpen, 
  onClose, 
  onLike, 
  onSave, 
  onShare 
}: TattooDetailModalProps) {
  const [comment, setComment] = useState('');

  // Prevenir scroll del body cuando el modal está abierto
  React.useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      
      // Aplicar estilos para prevenir scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      // Manejar tecla Escape para cerrar modal
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      // Prevenir scroll en eventos touch (móvil)
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      
      return () => {
        // Restaurar estilos del body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        
        // Restaurar posición del scroll
        window.scrollTo(0, scrollY);
        
        // Remover event listeners
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('touchmove', preventTouchMove);
      };
    }
  }, [isOpen, onClose]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log('Enviando comentario:', comment);
      // Aquí iría la lógica para enviar el comentario
      setComment('');
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const [showComments, setShowComments] = useState(true);

  if (!post) return null;

  // Mock comments data
  const mockComments = [
    {
      id: '1',
      user: { name: 'Ana García', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8d5?w=50&h=50&fit=crop&crop=face' },
      text: '¡Increíble trabajo! Me encanta el detalle del sombreado 😍',
      timestamp: '2h',
      likes: 12
    },
    {
      id: '2',
      user: { name: 'Carlos López', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
      text: '¿Cuánto tiempo te tomó este diseño?',
      timestamp: '4h',
      likes: 3
    },
    {
      id: '3',
      user: { name: 'María Rodríguez' },
      text: 'Necesito agendar una cita contigo! 🔥',
      timestamp: '6h',
      likes: 8
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overscroll-none"
          onClick={onClose}
          onTouchMove={(e) => e.preventDefault()}
        >
                           <motion.div
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   className="bg-dark-900 rounded-2xl overflow-hidden border border-dark-700 max-w-6xl w-full h-[95vh] md:h-[80vh] flex flex-col md:flex-row"
                   onClick={(e) => e.stopPropagation()}
                 >
            {/* Layout principal - columna única */}
            <div className="flex flex-col w-full h-full">
              {/* Botón de cerrar - posición absoluta arriba */}
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 z-10 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800/80 backdrop-blur-sm"
              >
                <X size={20} />
              </button>

              {/* Header con información del artista */}
              <div className="flex items-center gap-3 p-3 border-b border-gray-800 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                  {post.artist.avatar ? (
                    <img src={post.artist.avatar} alt={post.artist.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {post.artist.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {post.artist.name}
                    {post.artist.isVerified && (
                      <span className="ml-1 text-primary-500">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{post.style}</p>
                </div>
              </div>

              {/* Imagen principal - en el centro */}
              <div className="h-64 md:h-80 bg-black flex items-center justify-center flex-shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Panel de información inferior */}
              <div className="flex flex-col border-t border-gray-700 flex-1 overflow-y-auto modal-scroll-container min-h-0">
                {/* Información del tatuaje */}
                <div className="p-3 border-b border-gray-800 flex-shrink-0">
                <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-700 hover:border-primary-500/50 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-lg">
                    <Calendar size={16} />
                    Agendar Cita
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600">
                    <MessageCircle size={16} />
                    Contactar
                  </button>
                </div>
              </div>

              {/* Acciones principales */}
              <div className="p-3 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLike(post.id)}
                      className={`transition-all duration-200 ${
                        post.isLiked 
                          ? 'text-accent-500 hover:text-accent-400' 
                          : 'text-gray-400 hover:text-accent-500'
                      }`}
                    >
                      <Heart 
                        size={24} 
                        className={post.isLiked ? 'fill-current' : ''} 
                      />
                    </button>
                    
                    <button className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                      <MessageCircle size={24} />
                    </button>
                    
                    <button
                      onClick={() => onShare(post.id)}
                      className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                    >
                      <Share2 size={24} />
                    </button>
                    
                    <span className="text-white text-sm font-semibold">
                      {post.likes.toLocaleString()}
                    </span>
                    
                    <span className="text-gray-400 text-sm">
                      {mockComments.length + 5} comentarios
                    </span>
                    
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Star size={14} />
                      4.9
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onSave(post.id)}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    <Bookmark size={24} />
                  </button>
                </div>
              </div>

              {/* Comentarios */}
              <div className="border-b border-gray-800 flex-shrink-0">
                <div className="px-3 py-2">
                  <h4 className="text-white font-medium text-sm mb-3">Comentarios</h4>
                  <div className="space-y-2">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                          {comment.user.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-white">
                              {comment.user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-800 rounded-lg p-2">
                            <p className="text-white text-xs font-medium mb-1">{comment.user.name}</p>
                            <p className="text-gray-300 text-xs">{comment.text}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{comment.timestamp}</span>
                            <button className="hover:text-primary-400 transition-colors">
                              {comment.likes} me gusta
                            </button>
                            <button className="hover:text-primary-400 transition-colors">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Comentarios adicionales para mostrar el scroll */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={`extra-${i}`} className="flex gap-2">
                        <div className="w-7 h-7 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {String.fromCharCode(65 + (i % 26))}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-800 rounded-lg p-2">
                            <p className="text-white text-xs font-medium mb-1">Usuario {i + 4}</p>
                            <p className="text-gray-300 text-xs">
                              {i % 3 === 0 ? '¡Qué trabajo tan increíble! Me encanta el detalle.' : 
                               i % 3 === 1 ? 'Definitivamente quiero algo así 🔥' : 
                               '¿Cuánto costaría algo similar?'}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{i + 8}h</span>
                            <button className="hover:text-primary-400 transition-colors">
                              {Math.floor(Math.random() * 20) + 1} me gusta
                            </button>
                            <button className="hover:text-primary-400 transition-colors">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input de comentario */}
              <div className="p-3 bg-gray-900 flex-shrink-0 mb-4">
                <form onSubmit={handleCommentSubmit} className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="w-7 h-7 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">U</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Añade un comentario..."
                      value={comment}
                      onChange={handleCommentChange}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-sm"
                      autoComplete="off"
                    />
                    <button 
                      type="submit"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!comment.trim()}
                    >
                      <Send size={14} className="text-white" />
                    </button>
                  </div>
                </form>
              </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
