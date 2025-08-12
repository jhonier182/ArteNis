import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PostRepository, CreatePostData, PaginationOptions, PostsResult, FeedFilters, SearchPostsFilters } from '@domain/post/repositories/post.repository';
import { Post, PostStatus, PostType } from '@domain/post/entities/post';
import { PostEntity } from '../entities/post.entity';
import { MediaEntity } from '../entities/media.entity';

@Injectable()
export class PostRepositoryImpl implements PostRepository {
  constructor(
    @InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(MediaEntity) private readonly mediaRepo: Repository<MediaEntity>,
  ) {}

  private toDomain(e: PostEntity, mediaUrls: string[] = []): Post {
    return new Post(
      e.id,
      e.userId,
      e.type as unknown as PostType,
      e.title,
      e.description,
      e.tags || [],
      e.styles || [],
      mediaUrls,
      e.status as unknown as PostStatus,
      e.likesCount,
      e.commentsCount,
      e.savesCount,
      e.sharesCount,
      e.viewsCount,
      e.location,
      e.tattooDetails,
      e.isPromoted,
      e.promotedUntil,
      e.allowComments,
      e.allowSharing,
      e.scheduledAt,
      e.createdAt,
      e.updatedAt,
    );
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) return null;
    const media = await this.mediaRepo.find({ where: { postId: id }, order: { order: 'ASC' } });
    const urls = media.map(m => m.url);
    return this.toDomain(post, urls);
  }

  async findByUserId(userId: string, pagination: PaginationOptions): Promise<PostsResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.postRepo.findAndCount({
      where: { userId, status: PostStatus.PUBLISHED as unknown as any },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const postIds = rows.map(r => r.id);
    const media = postIds.length ? await this.mediaRepo.find({ where: { postId: In(postIds) } }) : [];
    const grouped: Record<string, string[]> = {};
    for (const m of media) {
      if (!grouped[m.postId]) grouped[m.postId] = [];
      grouped[m.postId].push(m.url);
    }
    return {
      posts: rows.map(r => this.toDomain(r, grouped[r.id] || [])),
      total,
    };
  }

  async getFeed(userId: string, pagination: PaginationOptions, filters?: FeedFilters): Promise<PostsResult> {
    const { page, limit } = pagination;
    const qb = this.postRepo.createQueryBuilder('post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filters?.styles?.length) {
      qb.andWhere('JSON_CONTAINS(:styles, JSON_ARRAY(post.styles)) = 1 OR post.styles REGEXP :stylesRegex', {
        styles: JSON.stringify(filters.styles),
        stylesRegex: filters.styles.join('|'),
      });
    }
    if (filters?.location) {
      qb.andWhere('post.location->>"$.city" LIKE :loc OR post.location->>"$.country" LIKE :loc', {
        loc: `%${filters.location}%`,
      });
    }

    const [rows, total] = await qb.getManyAndCount();
    const postIds = rows.map(r => r.id);
    const media = postIds.length ? await this.mediaRepo.find({ where: { postId: In(postIds) } }) : [];
    const grouped: Record<string, string[]> = {};
    for (const m of media) {
      if (!grouped[m.postId]) grouped[m.postId] = [];
      grouped[m.postId].push(m.url);
    }
    return {
      posts: rows.map(r => this.toDomain(r, grouped[r.id] || [])),
      total,
    };
  }

  async searchPosts(query: string, filters?: SearchPostsFilters, pagination?: PaginationOptions): Promise<PostsResult> {
    const { page = 1, limit = 20 } = pagination || {} as PaginationOptions;
    const qb = this.postRepo.createQueryBuilder('post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query) {
      qb.andWhere('(post.title LIKE :q OR post.description LIKE :q)', { q: `%${query}%` });
    }
    if (filters?.userId) qb.andWhere('post.userId = :uid', { uid: filters.userId });

    const [rows, total] = await qb.getManyAndCount();
    const postIds = rows.map(r => r.id);
    const media = postIds.length ? await this.mediaRepo.find({ where: { postId: In(postIds) } }) : [];
    const grouped: Record<string, string[]> = {};
    for (const m of media) {
      if (!grouped[m.postId]) grouped[m.postId] = [];
      grouped[m.postId].push(m.url);
    }
    return {
      posts: rows.map(r => this.toDomain(r, grouped[r.id] || [])),
      total,
    };
  }

  async getPopularPosts(pagination: PaginationOptions): Promise<PostsResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.postRepo.findAndCount({
      where: { status: PostStatus.PUBLISHED as unknown as any },
      order: { likesCount: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const ids = rows.map(r => r.id);
    const media = ids.length ? await this.mediaRepo.find({ where: { postId: In(ids) } }) : [];
    const group: Record<string, string[]> = {};
    for (const m of media) { (group[m.postId] ||= []).push(m.url); }
    return { posts: rows.map(r => this.toDomain(r, group[r.id] || [])), total };
  }

  async getRecentPosts(pagination: PaginationOptions): Promise<PostsResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.postRepo.findAndCount({
      where: { status: PostStatus.PUBLISHED as unknown as any },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const ids = rows.map(r => r.id);
    const media = ids.length ? await this.mediaRepo.find({ where: { postId: In(ids) } }) : [];
    const group: Record<string, string[]> = {};
    for (const m of media) { (group[m.postId] ||= []).push(m.url); }
    return { posts: rows.map(r => this.toDomain(r, group[r.id] || [])), total };
  }

  async getPostsByStyle(style: string, pagination: PaginationOptions): Promise<PostsResult> {
    const { page, limit } = pagination;
    const qb = this.postRepo.createQueryBuilder('post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('FIND_IN_SET(:style, post.styles) > 0', { style })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [rows, total] = await qb.getManyAndCount();
    const ids = rows.map(r => r.id);
    const media = ids.length ? await this.mediaRepo.find({ where: { postId: In(ids) } }) : [];
    const group: Record<string, string[]> = {};
    for (const m of media) { (group[m.postId] ||= []).push(m.url); }
    return { posts: rows.map(r => this.toDomain(r, group[r.id] || [])), total };
  }

  async getPostsByLocation(location: string, pagination: PaginationOptions): Promise<PostsResult> {
    const { page, limit } = pagination;
    const qb = this.postRepo.createQueryBuilder('post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.location->>"$.city" LIKE :loc OR post.location->>"$.country" LIKE :loc', { loc: `%${location}%` })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [rows, total] = await qb.getManyAndCount();
    const ids = rows.map(r => r.id);
    const media = ids.length ? await this.mediaRepo.find({ where: { postId: In(ids) } }) : [];
    const group: Record<string, string[]> = {};
    for (const m of media) { (group[m.postId] ||= []).push(m.url); }
    return { posts: rows.map(r => this.toDomain(r, group[r.id] || [])), total };
  }

  async create(data: CreatePostData): Promise<Post> {
    const entity = this.postRepo.create({
      userId: data.userId,
      title: data.title,
      description: data.description,
      tags: data.tags,
      styles: data.styles,
      location: data.location,
      tattooDetails: data.tattooDetails,
      allowComments: data.allowComments ?? true,
      allowSharing: data.allowSharing ?? true,
      status: PostStatus.PUBLISHED as unknown as any,
    });
    const saved = await this.postRepo.save(entity);

    const mediaUrls: string[] = data.mediaUrls || [];
    if (mediaUrls.length) {
      const mediaEntities = mediaUrls.map((url, idx) => this.mediaRepo.create({
        postId: saved.id,
        type: url.match(/\.(mp4|mov)$/i) ? ('video' as any) : ('image' as any),
        originalName: url.split('/').pop() || 'media',
        fileName: url.split('/').pop() || 'media',
        url,
        mimeType: url.match(/\.(mp4|mov)$/i) ? 'video/mp4' : 'image/webp',
        size: 0,
        isPrimary: idx === 0,
        order: idx,
      }));
      await this.mediaRepo.save(mediaEntities);
    }

    return this.findById(saved.id) as Promise<Post>;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    await this.postRepo.update(id, {
      title: data.title,
      description: data.description,
      tags: data.tags,
      styles: data.styles,
      location: data.location as any,
      tattooDetails: data.tattooDetails as any,
      allowComments: data.allowComments,
      allowSharing: data.allowSharing,
    });
    return (await this.findById(id)) as Post;
  }

  async delete(id: string): Promise<void> {
    await this.postRepo.delete(id);
  }

  async incrementViews(id: string): Promise<void> { await this.postRepo.increment({ id }, 'viewsCount', 1); }
  async incrementLikes(id: string): Promise<void> { await this.postRepo.increment({ id }, 'likesCount', 1); }
  async decrementLikes(id: string): Promise<void> { await this.postRepo.decrement({ id }, 'likesCount', 1); }
  async incrementComments(id: string): Promise<void> { await this.postRepo.increment({ id }, 'commentsCount', 1); }
  async decrementComments(id: string): Promise<void> { await this.postRepo.decrement({ id }, 'commentsCount', 1); }
  async incrementShares(id: string): Promise<void> { await this.postRepo.increment({ id }, 'sharesCount', 1); }
  async incrementSaves(id: string): Promise<void> { await this.postRepo.increment({ id }, 'savesCount', 1); }
  async decrementSaves(id: string): Promise<void> { await this.postRepo.decrement({ id }, 'savesCount', 1); }

  async getUserPostsCount(userId: string): Promise<number> { return this.postRepo.count({ where: { userId } }); }
  async getUserLikesCount(userId: string): Promise<number> { return this.postRepo.createQueryBuilder('p').where('p.userId = :u', { u: userId }).select('SUM(p.likesCount)', 'likes').getRawOne().then(r => Number(r?.likes || 0)); }
  async getPostStats(id: string) { const p = await this.postRepo.findOne({ where: { id } }); return { views: p?.viewsCount || 0, likes: p?.likesCount || 0, comments: p?.commentsCount || 0, shares: p?.sharesCount || 0, saves: p?.savesCount || 0 }; }
  async reportPost(id: string) { await this.postRepo.update(id, { status: PostStatus.REPORTED as unknown as any }); }
  async approvePost(id: string) { await this.postRepo.update(id, { status: PostStatus.PUBLISHED as unknown as any }); }
  async rejectPost(id: string) { await this.postRepo.update(id, { status: PostStatus.ARCHIVED as unknown as any }); }
}


