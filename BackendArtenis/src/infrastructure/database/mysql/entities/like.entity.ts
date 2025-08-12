import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('likes')
@Index(['postId', 'userId'], { unique: true })
export class LikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => PostEntity, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
