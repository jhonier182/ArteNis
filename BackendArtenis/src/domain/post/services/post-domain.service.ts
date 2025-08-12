import { Injectable } from '@nestjs/common';
import { Post, PostType, PostStatus } from '../entities/post';

@Injectable()
export class PostDomainService {
  
  /**
   * Determina el tipo de post basado en los archivos de media
   */
  determinePostType(mediaUrls: string[]): PostType {
    if (!mediaUrls.length) {
      return PostType.IMAGE; // Por defecto
    }

    if (mediaUrls.length === 1) {
      const url = mediaUrls[0].toLowerCase();
      if (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi')) {
        return PostType.VIDEO;
      }
      return PostType.IMAGE;
    }

    return PostType.GALLERY;
  }

  /**
   * Valida si un post puede ser publicado
   */
  canPublish(post: Post): boolean {
    // Un post debe tener al menos media o descripción
    const hasContent = post.hasMedia || (post.description && post.description.trim().length > 0);
    
    // No puede estar eliminado o reportado
    const validStatus = ![PostStatus.DELETED, PostStatus.REPORTED].includes(post.status);
    
    return hasContent && validStatus;
  }

  /**
   * Calcula la relevancia de un post para el feed
   */
  calculatePostRelevance(post: Post, userInterests: string[] = []): number {
    let score = 0;

    // Puntuación base por engagement
    score += post.likesCount * 2;
    score += post.commentsCount * 3;
    score += post.sharesCount * 5;
    score += post.viewsCount * 0.1;

    // Bonificación por recencia (posts más nuevos tienen más peso)
    const daysSinceCreation = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 1) score += 50;
    else if (daysSinceCreation <= 7) score += 25;
    else if (daysSinceCreation <= 30) score += 10;

    // Bonificación por coincidencia con intereses del usuario
    const matchingStyles = post.styles.filter(style => 
      userInterests.some(interest => interest.toLowerCase().includes(style.toLowerCase()))
    );
    score += matchingStyles.length * 20;

    // Bonificación por calidad del contenido
    if (post.description && post.description.length > 100) score += 10;
    if (post.hasMedia) score += 15;
    if (post.isGallery) score += 5;

    // Penalización por contenido reportado o controversial
    if (post.status === PostStatus.REPORTED) score -= 100;

    // Bonificación por promoción activa
    if (post.isActivePromotion) score += 30;

    return Math.max(0, score);
  }

  /**
   * Normaliza tags para consistencia
   */
  normalizeTags(tags: string[]): string[] {
    return tags
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => tag.length > 0 && tag.length <= 30)
      .filter((tag, index, arr) => arr.indexOf(tag) === index) // Eliminar duplicados
      .slice(0, 20); // Máximo 20 tags
  }

  /**
   * Normaliza estilos para consistencia
   */
  normalizeStyles(styles: string[]): string[] {
    const validStyles = [
      'realismo', 'tradicional', 'neotradional', 'acuarela', 'geométrico',
      'minimalista', 'blackwork', 'dotwork', 'tribal', 'japonés', 'oldschool',
      'newschool', 'biomecánico', 'surrealista', 'línea fina', 'lettering'
    ];

    return styles
      .map(style => style.toLowerCase().trim())
      .filter(style => validStyles.includes(style))
      .filter((style, index, arr) => arr.indexOf(style) === index)
      .slice(0, 10); // Máximo 10 estilos
  }

  /**
   * Valida los detalles del tatuaje
   */
  validateTattooDetails(details: any): boolean {
    if (!details) return true;

    const validBodyParts = [
      'brazo', 'pierna', 'espalda', 'pecho', 'cuello', 'cara', 'mano', 'pie',
      'antebrazo', 'pantorrilla', 'muslo', 'hombro', 'abdomen', 'costilla'
    ];

    const validSizes = ['pequeño', 'mediano', 'grande', 'muy grande'];

    if (details.bodyPart && !validBodyParts.includes(details.bodyPart.toLowerCase())) {
      return false;
    }

    if (details.size && !validSizes.includes(details.size.toLowerCase())) {
      return false;
    }

    if (details.duration && (details.duration < 0 || details.duration > 24)) {
      return false;
    }

    if (details.price && details.price < 0) {
      return false;
    }

    return true;
  }

  /**
   * Genera sugerencias de tags basadas en el contenido
   */
  suggestTags(post: Post): string[] {
    const suggestions: string[] = [];

    // Sugerencias basadas en estilos
    post.styles.forEach(style => {
      suggestions.push(style);
      if (style === 'realismo') suggestions.push('realista', 'hiperrealismo');
      if (style === 'acuarela') suggestions.push('colorido', 'artístico');
      if (style === 'minimalista') suggestions.push('simple', 'línea fina');
    });

    // Sugerencias basadas en detalles del tatuaje
    if (post.tattooDetails?.bodyPart) {
      suggestions.push(post.tattooDetails.bodyPart);
    }

    if (post.tattooDetails?.size) {
      suggestions.push(`tatuaje ${post.tattooDetails.size}`);
    }

    // Sugerencias basadas en la ubicación
    if (post.location?.city) {
      suggestions.push(post.location.city.toLowerCase());
    }

    return this.normalizeTags(suggestions);
  }

  /**
   * Verifica si un post necesita moderación
   */
  needsModeration(post: Post): boolean {
    // Posts con ciertas palabras clave necesitan moderación
    const flaggedWords = ['sangre', 'violencia', 'político', 'religioso'];
    
    const content = `${post.title || ''} ${post.description || ''}`.toLowerCase();
    const hasFlaggedContent = flaggedWords.some(word => content.includes(word));

    // Posts con muchos reports necesitan moderación
    const hasReports = post.status === PostStatus.REPORTED;

    // Posts de usuarios nuevos podrían necesitar moderación
    // (esto requeriría información del usuario)

    return hasFlaggedContent || hasReports;
  }
}
