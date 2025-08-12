import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() type: string;
  @ApiProperty({ required: false }) title?: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty({ type: [String], required: false }) tags?: string[];
  @ApiProperty({ type: [String], required: false }) styles?: string[];
  @ApiProperty() status: string;
  @ApiProperty() likesCount: number;
  @ApiProperty() commentsCount: number;
  @ApiProperty() savesCount: number;
  @ApiProperty() sharesCount: number;
  @ApiProperty() viewsCount: number;
  @ApiProperty({ required: false }) location?: any;
  @ApiProperty({ required: false }) tattooDetails?: any;
  @ApiProperty({ required: false }) isPromoted?: boolean;
  @ApiProperty({ required: false }) promotedUntil?: Date;
  @ApiProperty() allowComments: boolean;
  @ApiProperty() allowSharing: boolean;
  @ApiProperty({ required: false }) scheduledAt?: Date;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ type: [String], required: false }) mediaUrls?: string[];
}


