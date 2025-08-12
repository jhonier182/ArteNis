import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuoteRepository, QuoteDomainModel, CreateQuoteData, QuotesResult, PaginationOptions } from '@domain/booking/repositories/quote.repository';
import { QuoteEntity, QuoteStatus } from '../entities/quote.entity';

@Injectable()
export class QuoteRepositoryImpl implements QuoteRepository {
  constructor(
    @InjectRepository(QuoteEntity)
    private readonly repo: Repository<QuoteEntity>,
  ) {}

  async create(data: CreateQuoteData): Promise<QuoteDomainModel> {
    const entity = this.repo.create({ ...data, status: QuoteStatus.PENDING });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<QuoteDomainModel | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async update(
    id: string,
    data: Partial<CreateQuoteData & { status: QuoteStatus; estimatedPrice?: number }>,
  ): Promise<QuoteDomainModel> {
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) throw new Error('Cotización no encontrada tras actualizar');
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByClient(clientId: string, pagination: PaginationOptions): Promise<QuotesResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.repo.findAndCount({
      where: { clientId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { quotes: rows.map(this.toDomain), total };
  }

  async findByArtist(artistId: string, pagination: PaginationOptions): Promise<QuotesResult> {
    const { page, limit } = pagination;
    const [rows, total] = await this.repo.findAndCount({
      where: { artistId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { quotes: rows.map(this.toDomain), total };
  }

  private toDomain = (e: QuoteEntity): QuoteDomainModel => ({
    id: e.id,
    artistId: e.artistId,
    clientId: e.clientId,
    status: e.status,
    description: e.description,
    estimatedPrice: e.estimatedPrice as unknown as number,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}


