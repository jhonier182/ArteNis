export enum PostType {
  IMAGE = 'image',
  VIDEO = 'video',
  GALLERY = 'gallery',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REPORTED = 'reported',
  DELETED = 'deleted',
}

export class Post {
  constructor(
    public id: string,
    public userId: string,
    public type: PostType,
    public title?: string,
    public description?: string,
    public tags: string[] = [],
    public styles: string[] = [],
    public mediaUrls: string[] = [],
    public status: PostStatus = PostStatus.PUBLISHED,
    public likesCount: number = 0,
    public commentsCount: number = 0,
    public savesCount: number = 0,
    public sharesCount: number = 0,
    public viewsCount: number = 0,
    public location?: {
      name?: string;
      address?: string;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    },
    public tattooDetails?: {
      bodyPart?: string;
      size?: string;
      duration?: number;
      price?: number;
      currency?: string;
      healing?: string;
      technique?: string;
    },
    public isPromoted: boolean = false,
    public promotedUntil?: Date,
    public allowComments: boolean = true,
    public allowSharing: boolean = true,
    public scheduledAt?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  // Getters de conveniencia
  get isPublished(): boolean {
    return this.status === PostStatus.PUBLISHED;
  }

  get isDraft(): boolean {
    return this.status === PostStatus.DRAFT;
  }

  get isArchived(): boolean {
    return this.status === PostStatus.ARCHIVED;
  }

  get hasMedia(): boolean {
    return this.mediaUrls.length > 0;
  }

  get primaryMediaUrl(): string | undefined {
    return this.mediaUrls[0];
  }

  get isVideo(): boolean {
    return this.type === PostType.VIDEO;
  }

  get isGallery(): boolean {
    return this.type === PostType.GALLERY;
  }

  get engagementRate(): number {
    const totalEngagements = this.likesCount + this.commentsCount + this.sharesCount;
    return this.viewsCount > 0 ? (totalEngagements / this.viewsCount) * 100 : 0;
  }

  get isActivePromotion(): boolean {
    return this.isPromoted && 
           this.promotedUntil && 
           this.promotedUntil > new Date();
  }

  // Métodos de negocio
  publish(): void {
    this.status = PostStatus.PUBLISHED;
    this.updatedAt = new Date();
  }

  archive(): void {
    this.status = PostStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  incrementLikes(): void {
    this.likesCount++;
    this.updatedAt = new Date();
  }

  decrementLikes(): void {
    if (this.likesCount > 0) {
      this.likesCount--;
      this.updatedAt = new Date();
    }
  }

  incrementComments(): void {
    this.commentsCount++;
    this.updatedAt = new Date();
  }

  decrementComments(): void {
    if (this.commentsCount > 0) {
      this.commentsCount--;
      this.updatedAt = new Date();
    }
  }

  incrementViews(): void {
    this.viewsCount++;
  }

  addTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim();
    if (!this.tags.includes(normalizedTag)) {
      this.tags.push(normalizedTag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim();
    const index = this.tags.indexOf(normalizedTag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  addStyle(style: string): void {
    const normalizedStyle = style.toLowerCase().trim();
    if (!this.styles.includes(normalizedStyle)) {
      this.styles.push(normalizedStyle);
      this.updatedAt = new Date();
    }
  }

  removeStyle(style: string): void {
    const normalizedStyle = style.toLowerCase().trim();
    const index = this.styles.indexOf(normalizedStyle);
    if (index > -1) {
      this.styles.splice(index, 1);
      this.updatedAt = new Date();
    }
  }
}
