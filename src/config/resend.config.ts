import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export const ResendProvider = {
  provide: 'RESEND_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Resend(configService.get<string>('RESEND_KEY'));
  },
  inject: [ConfigService],
};

@Global() // ← To sprawia, że provider jest dostępny globalnie
@Module({
  imports: [ConfigModule],
  providers: [ResendProvider],
  exports: [ResendProvider],
})
export class ResendModule {}
