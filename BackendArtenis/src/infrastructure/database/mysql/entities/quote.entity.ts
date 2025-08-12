import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ArtistEntity } from './artist.entity';

export enum QuoteStatus {
  PENDING = 'pending',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('quotes')
export class QuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  artistId: string;

  @Column()
  clientId: string;

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.PENDING })
  status: QuoteStatus;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ArtistEntity, (artist) => artist.quotes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;

  @ManyToOne(() => UserEntity, (user) => user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: UserEntity;
}
