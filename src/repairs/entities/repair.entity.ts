import { DevicesEntity } from 'src/devices/entities/device.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
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
  id: string;

  @Column({ type: 'enum', enum: RepairStatus, default: RepairStatus.NEW })
  status: RepairStatus;

  @ManyToOne(() => DevicesEntity)
  @JoinColumn() // oznacza, że Repair będzie posiadać kolumnę z kluczem obcym deviceId
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
  parts: ToRepair[];
}
