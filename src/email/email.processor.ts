import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import { RepairsFormDto } from 'src/repairs/dto/form-repair.dto';
import { ConfigService } from '@nestjs/config';

@Processor('emailQueue')
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  // Implementujesz abstrakcyjną metodę process
  async process(job: Job<RepairsFormDto>) {
    console.log(`Dane: ${JSON.stringify(job.data)}`);
    const data = job.data;

    try {
      await this.mailerService.sendMail({
        replyTo: data.email,
        to: `Repear.pl - Serwis urządzeń Apple <${this.configService.get<string>('MAILER_USER')}>`,
        subject: `Nowe zgłoszenie naprawy: ${data.serialNumber}`,
        template: 'repair-form',
        context: {
          email: data.email,
          description: data.description,
          serialNumber: data.serialNumber,
          phone: data.phone,
        },
      });
      console.log(`Email wysłany do ${data.email}`);

      await this.mailerService.sendMail({
        to: data.email,
        subject: `Potwierdzenie zgłoszenia naprawy: ${data.serialNumber}`,
        template: 'thank-you-repair-form',
        context: {
          email: data.email,
          serialNumber: data.serialNumber,
          phone: data.phone,
          description: data.description,
        },
      });
    } catch (error) {
      console.error(`Błąd podczas wysyłania emaili: ${error.message}`);
    }
  }
}
