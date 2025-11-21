import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { config } from 'process';

export const BullMQConfig = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    connection: {
      host: configService.get<string>('QUEUE_HOST'),
      username: configService.get<string>('QUEUE_USER'),
      password: configService.get<string>('QUEUE_PASSWORD'),
      port: configService.get<number>('QUEUE_PORT'),
    },
  }),
  inject: [ConfigService],
});
