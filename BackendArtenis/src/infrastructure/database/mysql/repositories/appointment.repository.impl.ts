import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { AppointmentRepository, AppointmentDomainModel, CreateAppointmentData, AppointmentsResult, PaginationOptions } from '@domain/booking/repositories/appointment.repository';
import { AppointmentEntity, AppointmentStatus } from '../entities/appointment.entity';

@Injectable()
export class AppointmentRepositoryImpl implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly repo: Repository<AppointmentEntity>,
  ) {}

  async create(data: CreateAppointmentData): Promise<AppointmentDomainModel> {
    const entity = this.repo.create({ ...data, status: AppointmentStatus.PENDING });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<AppointmentDomainModel | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    await this.repo.update(id, { status });
  }

  async update(id: string, data: Partial<CreateAppointmentData>): Promise<AppointmentDomainModel> {
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) throw new Error('Cita no encontrada tras actualizar');
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByArtistAndInterval(artistId: string, start: Date, end: Date): Promise<AppointmentDomainModel[]> {
    const entities = await this.repo.find({
      where: { artistId, scheduledAt: Between(start, end) },
      order: { scheduledAt: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async findByClient(clientId: string, pagination: PaginationOptions): Promise<AppointmentsResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.repo.findAndCount({
      where: { clientId },
      order: { scheduledAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { appointments: rows.map(this.toDomain), total };
  }

  async findByArtist(artistId: string, pagination: PaginationOptions): Promise<AppointmentsResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.repo.findAndCount({
      where: { artistId },
      order: { scheduledAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { appointments: rows.map(this.toDomain), total };
  }

  private toDomain = (e: AppointmentEntity): AppointmentDomainModel => ({
    id: e.id,
    artistId: e.artistId,
    clientId: e.clientId,
    status: e.status,
    scheduledAt: e.scheduledAt,
    description: e.description,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}


