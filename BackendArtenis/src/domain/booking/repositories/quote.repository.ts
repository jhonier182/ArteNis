import { QuoteStatus } from '@infrastructure/database/mysql/entities/quote.entity';

export interface CreateQuoteData {
  artistId: string;
  clientId: string;
  description: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface QuoteDomainModel {
  id: string;
  artistId: string;
  clientId: string;
  status: QuoteStatus;
  description: string;
  estimatedPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotesResult {
  quotes: QuoteDomainModel[];
  total: number;
}

export abstract class QuoteRepository {
  abstract create(data: CreateQuoteData): Promise<QuoteDomainModel>;
  abstract findById(id: string): Promise<QuoteDomainModel | null>;
  abstract update(id: string, data: Partial<CreateQuoteData & { status: QuoteStatus; estimatedPrice?: number }>): Promise<QuoteDomainModel>;
  abstract delete(id: string): Promise<void>;
  abstract findByClient(clientId: string, pagination: PaginationOptions): Promise<QuotesResult>;
  abstract findByArtist(artistId: string, pagination: PaginationOptions): Promise<QuotesResult>;
}


