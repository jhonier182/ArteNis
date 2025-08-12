import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArtistRepository, ArtistProfileDomainModel } from '@domain/artist/repositories/artist.repository';
import { ArtistEntity } from '../entities/artist.entity';

@Injectable()
export class ArtistRepositoryImpl implements ArtistRepository {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly repo: Repository<ArtistEntity>,
  ) {}

  async findByUserId(userId: string): Promise<ArtistProfileDomainModel | null> {
    const e = await this.repo.findOne({ where: { userId } });
    return e ? this.toDomain(e) : null;
  }

  async createDefault(userId: string): Promise<ArtistProfileDomainModel> {
    const e = this.repo.create({ userId, businessName: '', description: '', isVerified: false });
    const saved = await this.repo.save(e);
    return this.toDomain(saved);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repo.delete({ userId });
  }

  private toDomain(e: ArtistEntity): ArtistProfileDomainModel {
    return {
      id: e.id,
      userId: e.userId,
      businessName: e.businessName,
      description: e.description,
      isVerified: e.isVerified,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  }
}


