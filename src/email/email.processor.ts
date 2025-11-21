import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';
import { RepairsFormDto } from 'src/repairs/dto/form-repair.dto';

@Processor('emailQueue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  // Implementujesz abstrakcyjną metodę process
  async process(job: Job<RepairsFormDto>) {
    console.log(`Dane: ${JSON.stringify(job.data)}`);
    const data = job.data;
    await this.mailerService.sendMail({
      replyTo: data.email,
      to: 'serwis@repear.pl',
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
  }
}
