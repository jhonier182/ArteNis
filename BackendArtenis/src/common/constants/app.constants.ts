// Roles de usuario
export const USER_ROLES = {
  USER: 'user',
  ARTIST: 'artist',
  ADMIN: 'admin',
} as const;

// Estados de usuario
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
} as const;

// Estados de artista
export const ARTIST_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  SUSPENDED: 'suspended',
} as const;

// Tipos de publicación
export const POST_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  REEL: 'reel',
  CAROUSEL: 'carousel',
} as const;

// Estados de publicación
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  REPORTED: 'reported',
  DELETED: 'deleted',
} as const;

// Estados de cita
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  RESCHEDULED: 'rescheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  APPOINTMENT_BOOKED: 'appointment_booked',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  QUOTE_RECEIVED: 'quote_received',
  QUOTE_ACCEPTED: 'quote_accepted',
  QUOTE_REJECTED: 'quote_rejected',
  PAYMENT_SUCCESSFUL: 'payment_successful',
  PAYMENT_FAILED: 'payment_failed',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Configuración de archivos
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg', 'video/quicktime'],
} as const;

// Configuración de cache
export const CACHE_KEYS = {
  USER_PROFILE: (id: string) => `user:profile:${id}`,
  ARTIST_PROFILE: (id: string) => `artist:profile:${id}`,
  POST_DETAILS: (id: string) => `post:${id}`,
  USER_FEED: (id: string, page: number) => `feed:${id}:${page}`,
  SEARCH_RESULTS: (query: string, filters: string) => `search:${query}:${filters}`,
} as const;

// Tiempo de cache (en segundos)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutos
  MEDIUM: 1800, // 30 minutos
  LONG: 3600, // 1 hora
  VERY_LONG: 86400, // 24 horas
} as const;
