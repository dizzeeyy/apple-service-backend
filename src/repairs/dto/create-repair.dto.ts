import { IsEnum, IsUUID, IsOptional, IsString } from 'class-validator';
import { RepairStatus, ToRepair } from '../entities/repair.entity';

export class CreateRepairDto {
  @IsOptional() // jeśli status będzie opcjonalny, bo ma domyślny
  @IsEnum(RepairStatus)
  status?: RepairStatus;

  @IsUUID()
  deviceId: string;

  @IsOptional()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  description?: string; // np. dodatkowy opis naprawy

  @IsOptional()
  @IsEnum(ToRepair, { each: true })
  parts?: ToRepair[];
}
