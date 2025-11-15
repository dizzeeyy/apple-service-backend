import { RepairEntity } from 'src/repairs/entities/repair.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DevicesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120, unique: true })
  name: string;

  @Column({ name: 'short_description', length: 255 })
  shortDescription: string;

  @Column({ name: 'long_description', length: 65353 })
  longDescription: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @OneToMany(() => RepairEntity, (repair) => repair.device)
  repair: RepairEntity[];

  @ManyToMany(() => UserEntity, (user) => user.device)
  users: UserEntity[];
}
