import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'username' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'email@account.com' })
  email: string;

  @IsPhoneNumber('PL')
  @IsNotEmpty()
  @ApiProperty({ example: '111222333' })
  phone: string;
}
