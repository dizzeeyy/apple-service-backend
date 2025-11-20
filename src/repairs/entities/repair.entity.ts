import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DevicesEntity } from 'src/devices/entities/device.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RepairStatus {
  NEW = 'new',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ToRepair {
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

@Entity()
export class RepairEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '75b5e9f0-42cb-4f04-a5b2-27738ff4b184' })
  id: string;

  @Column({ unique: true })
  repairNumber: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ example: 'W2TQQQDJ8K' })
  serialNumber: string;

  @Column({ type: 'enum', enum: RepairStatus, default: RepairStatus.NEW })
  @ApiProperty({ enum: RepairStatus, example: Object.values(RepairStatus) })
  status: RepairStatus;

  @ManyToOne(() => DevicesEntity)
  @JoinColumn() // oznacza, że Repair będzie posiadać kolumnę z kluczem obcym deviceId
  @ApiProperty({ type: () => DevicesEntity })
  @Type(() => DevicesEntity)
  device: DevicesEntity;

  @ManyToOne(() => UserEntity, (user) => user.repairs)
  @JoinColumn()
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ToRepair,
    array: true,
    default: [ToRepair.TBA],
  })
  @ApiProperty({
    enum: ToRepair,
    isArray: true,
    example: Object.values(ToRepair),
  })
  parts: ToRepair[];
}
