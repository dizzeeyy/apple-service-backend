import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'aa0710ec-3214-46b9-a647-c4cfa9d4cb9a' })
  id: string;

  @Column({ length: 120 })
  @ApiProperty({ example: 'iPhone 13 Pro Max 256GB (grafitowy)' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'W2TQQQDJ8K' })
  serialNumber: string;

  @Column('text', { array: true, nullable: true })
  @ApiProperty({
    example: ['https://link.to/image1.png', 'https://link.to/image2.png'],
  })
  images: string[];

  @OneToMany(() => RepairEntity, (repair) => repair.device)
  repair: RepairEntity[];

  @ManyToMany(() => UserEntity, (user) => user.device)
  users: UserEntity[];
}
