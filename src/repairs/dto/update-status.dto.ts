import { IsEnum, IsString } from 'class-validator';
import { RepairStatus } from '../entities/repair.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @IsString()
  @ApiProperty({ example: 'R-000001' })
  repairNumber: string;

  @IsEnum(RepairStatus)
  @ApiProperty({ example: Object.values(RepairStatus) })
  status: RepairStatus;
}
