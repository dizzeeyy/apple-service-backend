import { Exclude } from 'class-transformer';
import { DevicesEntity } from 'src/devices/entities/device.entity';
import { RepairEntity } from 'src/repairs/entities/repair.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @ManyToMany(() => DevicesEntity, (device) => device.users)
  @JoinTable()
  device: DevicesEntity[];

  @Column({ name: 'repairs_finished', nullable: true })
  repairsFinished: string;

  @Column({ name: 'in_repair', nullable: true })
  inRepair: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @OneToMany(() => RepairEntity, (repair) => repair.user)
  repairs: RepairEntity[];
}
