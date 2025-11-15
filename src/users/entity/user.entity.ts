import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  devices: string;

  @Column({ name: 'repairs_finished', nullable: true })
  repairsFinished: string;

  @Column({ name: 'in_repair', nullable: true })
  inRepair: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;
}
