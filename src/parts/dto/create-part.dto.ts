// src/parts/dto/create-part.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartType } from '../entities/parts.entity';
import { Transform } from 'class-transformer';

export class CreatePartDto {
  @ApiProperty({ enum: PartType })
  @IsEnum(PartType)
  type: PartType;

  @ApiProperty({ example: 'iPhone 17 Pro Max Display' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1499' })
  @IsNumber()
  @Min(0)
  // @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
