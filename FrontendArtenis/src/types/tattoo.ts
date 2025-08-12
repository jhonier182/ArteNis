export interface TattooPost {
  id: string;
  imageUrl: string;
  title: string;
  artist: {
    id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
  likes: number;
  isLiked: boolean;
  tags: string[];
  style: string;
  height?: number; // Para simular diferentes alturas en el masonry grid
}

export interface Artist {
  id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  bio?: string;
  location?: string;
  specialties?: string[];
  rating?: number;
  portfolio?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    instagram?: string;
    website?: string;
  };
}
