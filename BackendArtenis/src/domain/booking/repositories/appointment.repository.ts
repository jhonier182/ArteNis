import { AppointmentStatus } from '@infrastructure/database/mysql/entities/appointment.entity';

export interface CreateAppointmentData {
  artistId: string;
  clientId: string;
  scheduledAt: Date;
  description?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface AppointmentDomainModel {
  id: string;
  artistId: string;
  clientId: string;
  status: AppointmentStatus;
  scheduledAt: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentsResult {
  appointments: AppointmentDomainModel[];
  total: number;
}

export abstract class AppointmentRepository {
  abstract create(data: CreateAppointmentData): Promise<AppointmentDomainModel>;
  abstract findById(id: string): Promise<AppointmentDomainModel | null>;
  abstract updateStatus(id: string, status: AppointmentStatus): Promise<void>;
  abstract update(id: string, data: Partial<CreateAppointmentData>): Promise<AppointmentDomainModel>;
  abstract delete(id: string): Promise<void>;
  abstract findByArtistAndInterval(
    artistId: string,
    start: Date,
    end: Date,
  ): Promise<AppointmentDomainModel[]>;
  abstract findByClient(
    clientId: string,
    pagination: PaginationOptions,
  ): Promise<AppointmentsResult>;
  abstract findByArtist(
    artistId: string,
    pagination: PaginationOptions,
  ): Promise<AppointmentsResult>;
}


