import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { DevicesModule } from './devices/devices.module';
import { RepairsModule } from './repairs/repairs.module';
import { MailerConfig } from './config/mailer.config';
import { BullMQConfig } from './config/bullmq.config';
import { PartsModule } from './parts/parts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModuleConfig,
    MailerConfig,
    BullMQConfig,
    UsersModule,
    AuthModule,
    DevicesModule,
    RepairsModule,
    PartsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
