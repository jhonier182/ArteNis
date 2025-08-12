import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { AppointmentEntity } from './appointment.entity';
import { QuoteEntity } from './quote.entity';

export enum ArtistStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended',
}

@Entity('artists')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  businessName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ type: 'simple-array', nullable: true })
  styles: string[];

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({
    type: 'enum',
    enum: ArtistStatus,
    default: ArtistStatus.PENDING,
  })
  status: ArtistStatus;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationDocuments: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ type: 'json', nullable: true })
  pricing: {
    consultationFee?: number;
    hourlyRate?: number;
    minimumCharge?: number;
    currency?: string;
  };

  @Column({ type: 'json', nullable: true })
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    };
  };

  @Column({ type: 'json', nullable: true })
  portfolio: {
    featured?: string[];
    categories?: {
      [category: string]: string[];
    };
  };

  @Column({ default: false })
  acceptsWalkIns: boolean;

  @Column({ default: true })
  bookingEnabled: boolean;

  @Column({ nullable: true })
  cancellationPolicy: string;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => UserEntity, (user) => user.artistProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.artist)
  appointments: AppointmentEntity[];

  @OneToMany(() => QuoteEntity, (quote) => quote.artist)
  quotes: QuoteEntity[];
}
