import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: '62f23cdb-87da-43e7-a3js-4502e2acb626' })
  userId: string;

  @Column()
  @ApiProperty({ example: 'username' })
  username: string;

  @Column()
  @Exclude()
  @ApiProperty({ example: 'password' })
  password: string;

  @Column()
  @ApiProperty({ example: 'email@account.com' })
  email: string;

  @Column()
  @ApiProperty({ example: '111222333' })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @ManyToMany(() => DevicesEntity, (device) => device.users)
  @JoinTable()
  @ApiProperty({ type: DevicesEntity, isArray: true })
  device: DevicesEntity[];

  @OneToMany(() => RepairEntity, (repair) => repair.user)
  @ApiProperty({ type: RepairEntity, isArray: true })
  repairs: RepairEntity[];
}
