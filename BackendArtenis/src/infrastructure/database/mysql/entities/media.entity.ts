import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  postId: string;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => PostEntity, (post) => post.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
