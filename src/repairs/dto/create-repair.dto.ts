import {
  IsEnum,
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { RepairStatus, ToRepair } from '../entities/repair.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartEntity } from 'src/parts/entities/parts.entity';

export class CreateRepairDto {
  @IsOptional() // jeśli status będzie opcjonalny, bo ma domyślny
  @IsEnum(RepairStatus)
  @ApiProperty({ enum: RepairStatus, example: Object.values(RepairStatus) })
  status?: RepairStatus;

  @IsUUID()
  @ApiProperty({ example: 'uuidv4' })
  deviceId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'W2TQJJJLSK4' })
  serialNumber: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: 'uuidv4' })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'description' })
  description?: string; // np. dodatkowy opis naprawy

  @ApiProperty({ example: 'uuiv4', isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  parts?: string[];
}
