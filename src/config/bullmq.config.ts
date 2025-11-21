import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { config } from 'process';

export const BullMQConfig = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    connection: { url: configService.get<string>('QUEUE_HOST') },
  }),
  inject: [ConfigService],
});
