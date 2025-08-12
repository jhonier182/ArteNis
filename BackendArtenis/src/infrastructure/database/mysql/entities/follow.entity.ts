import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follows')
@Index(['followerId', 'followingId'], { unique: true })
export class FollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followerId: string;

  @Column()
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => UserEntity, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followerId' })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followingId' })
  following: UserEntity;
}
