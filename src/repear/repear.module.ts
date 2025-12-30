import { Module } from '@nestjs/common';
import { RepearService } from './repear.service';
import { RepearController } from './repear.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      baseURL: 'https://api.repear.pl',
      timeout: 59000,
    }),
  ],
  providers: [RepearService],
  controllers: [RepearController],
  exports: [RepearService],
})
export class RepearModule {}
