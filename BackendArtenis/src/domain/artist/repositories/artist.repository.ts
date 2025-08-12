export interface CreateArtistProfileData {
  userId: string;
  businessName?: string;
  description?: string;
}

export interface ArtistProfileDomainModel {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class ArtistRepository {
  abstract findByUserId(userId: string): Promise<ArtistProfileDomainModel | null>;
  abstract createDefault(userId: string): Promise<ArtistProfileDomainModel>;
  abstract deleteByUserId(userId: string): Promise<void>;
}


