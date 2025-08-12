// Entidad de dominio User (lógica de negocio pura)
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly avatar?: string,
    public readonly bio?: string,
    public readonly phone?: string,
    public readonly dateOfBirth?: Date,
    public readonly language: string = 'es',
    public readonly emailVerified: boolean = false,
    public readonly phoneVerified: boolean = false,
    public readonly isPremium: boolean = false,
    public readonly premiumExpiresAt?: Date,
    public readonly lastLoginAt?: Date,
    public readonly preferences?: UserPreferences,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly followersCount: number = 0,
    public readonly followingCount: number = 0,
  ) {}

  // Métodos de dominio (lógica de negocio)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isArtist(): boolean {
    return this.role === UserRole.ARTIST;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  get canCreatePosts(): boolean {
    return this.isActive && !this.isSuspended();
  }

  get canBookAppointments(): boolean {
    return this.isActive && this.emailVerified;
  }

  get isPremiumActive(): boolean {
    if (!this.isPremium) return false;
    if (!this.premiumExpiresAt) return true;
    return this.premiumExpiresAt > new Date();
  }

  get displayLanguage(): string {
    return this.language || 'es';
  }

  // Métodos de negocio
  public isSuspended(): boolean {
    return this.status === UserStatus.SUSPENDED || this.status === UserStatus.BANNED;
  }

  public canUpgradeRole(): boolean {
    return this.role === UserRole.USER && this.isActive && this.emailVerified;
  }

  public hasPermission(permission: string): boolean {
    // Lógica de permisos basada en roles
    switch (this.role) {
      case UserRole.ADMIN:
        return true;
      case UserRole.ARTIST:
        return ['create_posts', 'manage_appointments', 'view_analytics'].includes(permission);
      case UserRole.USER:
        return ['create_posts', 'book_appointments', 'like_posts'].includes(permission);
      default:
        return false;
    }
  }

  public shouldReceiveNotification(type: string): boolean {
    if (!this.preferences?.notifications) return true;
    
    const notificationSettings = this.preferences.notifications;
    
    switch (type) {
      case 'likes':
        return notificationSettings.likes ?? true;
      case 'comments':
        return notificationSettings.comments ?? true;
      case 'follows':
        return notificationSettings.follows ?? true;
      case 'email':
        return notificationSettings.email ?? true;
      case 'push':
        return notificationSettings.push ?? true;
      default:
        return true;
    }
  }

  public validateProfileCompleteness(): ProfileCompletenessResult {
    const requiredFields = ['email', 'username', 'firstName', 'lastName'];
    const missingFields = requiredFields.filter(field => !this[field]);
    
    const optionalFields = ['avatar', 'bio', 'phone'];
    const completedOptionalFields = optionalFields.filter(field => this[field]);
    
    const completeness = ((requiredFields.length - missingFields.length) + completedOptionalFields.length) / 
                        (requiredFields.length + optionalFields.length);
    
    return {
      isComplete: missingFields.length === 0,
      completeness: Math.round(completeness * 100),
      missingRequiredFields: missingFields,
      suggestions: this.getProfileSuggestions(),
    };
  }

  private getProfileSuggestions(): string[] {
    const suggestions: string[] = [];
    
    if (!this.avatar) suggestions.push('Agrega una foto de perfil');
    if (!this.bio) suggestions.push('Escribe una biografía');
    if (!this.phone && !this.phoneVerified) suggestions.push('Verifica tu número de teléfono');
    if (!this.emailVerified) suggestions.push('Verifica tu email');
    
    return suggestions;
  }
}

// Enums y tipos de dominio
export enum UserRole {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
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

export interface ProfileCompletenessResult {
  isComplete: boolean;
  completeness: number;
  missingRequiredFields: string[];
  suggestions: string[];
}
