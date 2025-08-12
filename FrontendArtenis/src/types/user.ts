export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'user' | 'artist' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  avatar?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  language: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string;
  lastLoginAt?: string;
  isArtist: boolean;
  isAdmin: boolean;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  darkMode?: boolean;
  notifications?: {
    email?: boolean;
    push?: boolean;
    likes?: boolean;
    comments?: boolean;
    follows?: boolean;
  };
  privacy?: {
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
  };
}
