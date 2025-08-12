import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, MaxLength, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() latitude?: number;
  @ApiPropertyOptional() @IsOptional() longitude?: number;
}

class TattooDetailsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() bodyPart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() size?: string;
  @ApiPropertyOptional() @IsOptional() duration?: number;
  @ApiPropertyOptional() @IsOptional() price?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() healing?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technique?: string;
}

export class CreatePostDto {
  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  styles?: string[];

  @ApiPropertyOptional({ type: LocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({ type: TattooDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TattooDetailsDto)
  tattooDetails?: TattooDetailsDto;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  allowComments?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  allowSharing?: boolean = true;
}


