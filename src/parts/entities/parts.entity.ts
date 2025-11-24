// src/parts/entities/part.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { ColumnNumericTransformer } from 'src/common/transformers/column-numeric.transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PartType {
  IPHONE_DISPLAY = 'iphone_display',
  IPHONE_BODY = 'iphone_body',
  IPHONE_CAMERA = 'iphone_camera',
  IPHONE_SPEAKER = 'iphone_speaker',
  IPHONE_HAPTIC = 'iphone_haptic',
  MAC_DISPLAY = 'mac_display',
  MAC_TOP = 'mac_top',
  MAC_MOBO = 'mac_mobo',
  MAC_USB = 'mac_usb',
  TBA = 'tba',
}

@Entity('parts')
export class PartEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'uuidv4' })
  id: string;

  @Column({ type: 'enum', enum: PartType, unique: false })
  @ApiProperty({ enum: PartType })
  type: PartType;

  @Column()
  @ApiProperty({ example: 'iPhone Display Replacement' })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @ApiProperty({ example: 299.99 })
  price: number;

  @Column({ default: true })
  @ApiProperty({ example: true })
  isActive: boolean;
}
