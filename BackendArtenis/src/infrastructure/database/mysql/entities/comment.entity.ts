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
import { PostEntity } from './post.entity';

@Entity('comments')
@Index(['postId'])
@Index(['userId'])
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  parentId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  repliesCount: number;

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies: CommentEntity[];
}
