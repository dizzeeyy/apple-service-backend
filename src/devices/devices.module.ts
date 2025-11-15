import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesEntity } from './entities/device.entity';
import { RepairEntity } from 'src/repairs/entities/repair.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DevicesEntity, RepairEntity]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
