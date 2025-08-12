import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './like.entity';
import { BoardPostEntity } from './board-post.entity';
import { MediaEntity } from './media.entity';

export enum PostType {
  IMAGE = 'image',
  VIDEO = 'video',
  REEL = 'reel',
  CAROUSEL = 'carousel',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REPORTED = 'reported',
  DELETED = 'deleted',
}

@Entity('posts')
@Index(['userId'])
@Index(['createdAt'])
@Index(['status'])
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.IMAGE,
  })
  type: PostType;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  styles: string[];

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PUBLISHED,
  })
  status: PostStatus;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  savesCount: number;

  @Column({ default: 0 })
  sharesCount: number;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ type: 'json', nullable: true })
  location: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };

  @Column({ type: 'json', nullable: true })
  tattooDetails: {
    bodyPart?: string;
    size?: string;
    duration?: number;
    price?: number;
    currency?: string;
    healing?: string;
    technique?: string;
  };

  @Column({ default: false })
  isPromoted: boolean;

  @Column({ nullable: true })
  promotedUntil: Date;

  @Column({ default: true })
  allowComments: boolean;

  @Column({ default: true })
  allowSharing: boolean;

  @Column({ nullable: true })
  scheduledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => MediaEntity, (media) => media.post)
  media: MediaEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @OneToMany(() => BoardPostEntity, (boardPost) => boardPost.post)
  boardPosts: BoardPostEntity[];
}
