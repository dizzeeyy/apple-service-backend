import { Module } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairEntity } from './entities/repair.entity';
import { DevicesEntity } from 'src/devices/entities/device.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { DevicesService } from 'src/devices/devices.service';
import { EmailService } from 'src/email/email.service';
import { EmailProcessor } from 'src/email/email.processor';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { PartEntity } from 'src/parts/entities/parts.entity';
import { RepearService } from 'src/repear/repear.service';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      RepairEntity,
      DevicesEntity,
      UserEntity,
      RepairEntity,
      PartEntity,
    ]),
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    MailerModule,
  ],
  controllers: [RepairsController],
  providers: [
    RepairsService,
    UsersService,
    DevicesService,
    EmailService,
    EmailProcessor,
    RepearService,
    HttpService,
  ],
})
export class RepairsModule {}
