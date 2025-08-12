// Servicio de dominio para lógica de negocio compleja del usuario
import { User, UserRole, UserStatus } from '../entities/user';
import { UserRepository, UserStats } from '../repositories/user.repository';
import { Inject } from '@nestjs/common';

export class UserDomainService {
  constructor(@Inject('UserRepository') private userRepository: UserRepository) {}

  // Lógica de negocio para determinar si un usuario puede seguir a otro
  async canUserFollow(follower: User, following: User): Promise<CanFollowResult> {
    // Validaciones de negocio
    if (follower.id === following.id) {
      return {
        canFollow: false,
        reason: 'No puedes seguirte a ti mismo',
      };
    }

    if (!follower.isActive) {
      return {
        canFollow: false,
        reason: 'Tu cuenta debe estar activa para seguir usuarios',
      };
    }

    if (!following.isActive) {
      return {
        canFollow: false,
        reason: 'No puedes seguir una cuenta inactiva',
      };
    }

    // Verificar si ya sigue al usuario
    const isAlreadyFollowing = await this.userRepository.isFollowing(follower.id, following.id);
    if (isAlreadyFollowing) {
      return {
        canFollow: false,
        reason: 'Ya sigues a este usuario',
      };
    }

    // Verificar límites de seguimiento
    const followingCount = await this.userRepository.getFollowingCount(follower.id);
    const maxFollowing = follower.isPremiumActive ? 5000 : 1000;
    
    if (followingCount >= maxFollowing) {
      return {
        canFollow: false,
        reason: `Has alcanzado el límite de ${maxFollowing} usuarios seguidos`,
      };
    }

    return {
      canFollow: true,
      reason: 'Puede seguir al usuario',
    };
  }

  // Lógica para calcular la reputación de un usuario
  async calculateUserReputation(userId: string): Promise<UserReputation> {
    const stats = await this.userRepository.getUserStats(userId);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    let baseScore = 0;

    // Puntuación base por actividad
    baseScore += Math.min(stats.totalPosts * 5, 500); // Máximo 500 puntos por posts
    baseScore += Math.min(stats.totalLikes * 1, 1000); // Máximo 1000 puntos por likes
    baseScore += Math.min(stats.totalComments * 2, 300); // Máximo 300 puntos por comentarios
    baseScore += Math.min(stats.totalFollowers * 3, 2000); // Máximo 2000 puntos por seguidores

    // Bonificaciones
    if (user.emailVerified) baseScore += 50;
    if (user.phoneVerified) baseScore += 30;
    if (user.isPremiumActive) baseScore += 100;
    if (user.isArtist) baseScore += 200;

    // Penalizaciones por tiempo inactivo
    const daysSinceLastActivity = Math.floor(
      (Date.now() - stats.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastActivity > 30) {
      baseScore = Math.max(0, baseScore - (daysSinceLastActivity - 30) * 2);
    }

    // Calcular nivel basado en puntuación
    const level = this.calculateUserLevel(baseScore);

    return {
      score: baseScore,
      level: level.level,
      levelName: level.name,
      nextLevelScore: level.nextLevelScore,
      badges: this.calculateUserBadges(user, stats),
    };
  }

  // Lógica para determinar si un usuario puede convertirse en artista
  async canBecomeArtist(user: User): Promise<CanBecomeArtistResult> {
    if (user.role !== UserRole.USER) {
      return {
        canBecome: false,
        reason: 'Solo los usuarios regulares pueden convertirse en artistas',
        requirements: [],
      };
    }

    if (!user.isActive) {
      return {
        canBecome: false,
        reason: 'La cuenta debe estar activa',
        requirements: [],
      };
    }

    const requirements = await this.getArtistRequirements(user);
    const unmetRequirements = requirements.filter(req => !req.isMet);

    return {
      canBecome: unmetRequirements.length === 0,
      reason: unmetRequirements.length === 0 
        ? 'Cumple todos los requisitos para ser artista'
        : `Faltan ${unmetRequirements.length} requisitos`,
      requirements: requirements,
    };
  }

  private async getArtistRequirements(user: User): Promise<ArtistRequirement[]> {
    const stats = await this.userRepository.getUserStats(user.id);
    
    return [
      {
        name: 'Email verificado',
        description: 'Debes verificar tu dirección de email',
        isMet: user.emailVerified,
        priority: 'high',
      },
      {
        name: 'Perfil completo',
        description: 'Completa toda la información de tu perfil',
        isMet: user.validateProfileCompleteness().isComplete,
        priority: 'high',
      },
      {
        name: 'Actividad mínima',
        description: 'Al menos 5 publicaciones',
        isMet: stats.totalPosts >= 5,
        priority: 'medium',
      },
      {
        name: 'Seguidores mínimos',
        description: 'Al menos 10 seguidores',
        isMet: stats.totalFollowers >= 10,
        priority: 'low',
      },
      {
        name: 'Tiempo de registro',
        description: 'Cuenta con al menos 30 días de antigüedad',
        isMet: this.daysSinceJoin(stats.joinDate) >= 30,
        priority: 'medium',
      },
    ];
  }

  private calculateUserLevel(score: number): UserLevel {
    const levels = [
      { min: 0, max: 99, level: 1, name: 'Novato' },
      { min: 100, max: 299, level: 2, name: 'Aprendiz' },
      { min: 300, max: 599, level: 3, name: 'Intermedio' },
      { min: 600, max: 999, level: 4, name: 'Avanzado' },
      { min: 1000, max: 1999, level: 5, name: 'Experto' },
      { min: 2000, max: 3999, level: 6, name: 'Maestro' },
      { min: 4000, max: 7999, level: 7, name: 'Leyenda' },
      { min: 8000, max: Infinity, level: 8, name: 'Artenis Pro' },
    ];

    const currentLevel = levels.find(l => score >= l.min && score <= l.max);
    const nextLevel = levels.find(l => l.level === (currentLevel?.level || 0) + 1);

    return {
      level: currentLevel?.level || 1,
      name: currentLevel?.name || 'Novato',
      nextLevelScore: nextLevel?.min || 0,
    };
  }

  private calculateUserBadges(user: User, stats: UserStats): string[] {
    const badges: string[] = [];

    // Badges por verificación
    if (user.emailVerified) badges.push('email-verified');
    if (user.phoneVerified) badges.push('phone-verified');

    // Badges por actividad
    if (stats.totalPosts >= 100) badges.push('prolific-creator');
    if (stats.totalFollowers >= 1000) badges.push('influencer');
    if (stats.totalLikes >= 10000) badges.push('loved-creator');

    // Badges por tiempo
    const daysSinceJoin = this.daysSinceJoin(stats.joinDate);
    if (daysSinceJoin >= 365) badges.push('veteran');
    if (daysSinceJoin >= 30) badges.push('established');

    // Badges especiales
    if (user.isPremiumActive) badges.push('premium');
    if (user.isArtist) badges.push('artist');

    return badges;
  }

  private daysSinceJoin(joinDate: Date): number {
    return Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}

// Tipos de respuesta
export interface CanFollowResult {
  canFollow: boolean;
  reason: string;
}

export interface UserReputation {
  score: number;
  level: number;
  levelName: string;
  nextLevelScore: number;
  badges: string[];
}

export interface CanBecomeArtistResult {
  canBecome: boolean;
  reason: string;
  requirements: ArtistRequirement[];
}

export interface ArtistRequirement {
  name: string;
  description: string;
  isMet: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface UserLevel {
  level: number;
  name: string;
  nextLevelScore: number;
}
