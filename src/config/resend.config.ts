import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResendModule } from 'nestjs-resend';

export const MailerConfig = ResendModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    apiKey: configService.get<string>('RESEND_KEY'),
  }),
  inject: [ConfigService],
});
