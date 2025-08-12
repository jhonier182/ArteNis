import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ArtistEntity } from './artist.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  artistId: string;

  @Column()
  clientId: string;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column()
  scheduledAt: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ArtistEntity, (artist) => artist.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;

  @ManyToOne(() => UserEntity, (user) => user.clientAppointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: UserEntity;
}
