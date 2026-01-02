// repairs-form.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RepairsFormDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  serialNumber: string;

  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  repairNumber: string;
}
