import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { ArtistEntity } from './artist.entity';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './like.entity';
import { BoardEntity } from './board.entity';
import { AppointmentEntity } from './appointment.entity';
import { NotificationEntity } from './notification.entity';
import { FollowEntity } from './follow.entity';

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

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ default: 'es' })
  language: string; // 'es' o 'en'

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  premiumExpiresAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'json', nullable: true })
  preferences: {
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
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => ArtistEntity, (artist) => artist.user)
  artistProfile: ArtistEntity;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => BoardEntity, (board) => board.user)
  boards: BoardEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.client)
  clientAppointments: AppointmentEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  following: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];

  // Métodos virtuales
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isArtist(): boolean {
    return this.role === UserRole.ARTIST;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get followersCount(): number {
    return this.followers?.length || 0;
  }

  get followingCount(): number {
    return this.following?.length || 0;
  }
}
