import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export const MailerConfig = MailerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('MAILER_SMTP'),
      port: 465,
      secure: true,
      auth: {
        user: configService.get<string>('MAILER_FROM_ADDRESS'),
        pass: configService.get<string>('MAILER_PASSWORD'),
      },
      logger: true,
      debug: true,
    },
    defaults: {
      from: `"Serwis Repear.pl" <naprawy@repear.pl>`,
    },
    template: {
      dir: __dirname + '/templates/emails',
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
});
