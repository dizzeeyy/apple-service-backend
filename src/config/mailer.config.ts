import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
const templatePath = join(process.cwd(), 'src/config/templates/emails');
export const MailerConfig = MailerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('MAILER_SMTP'),
      secure: true,
      logger: true,
      debug: true,
    },
    defaults: {
      from: `"Serwis Repear.pl" <serwis@repear.pl>`,
    },
    template: {
      dir: templatePath,
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
});
