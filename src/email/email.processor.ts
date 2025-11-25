// import { Processor, WorkerHost } from '@nestjs/bullmq';
// import { MailerService } from '@nestjs-modules/mailer';
// import { Job } from 'bullmq';
// import { RepairsFormDto } from 'src/repairs/dto/form-repair.dto';
// import { ConfigService } from '@nestjs/config';

// @Processor('emailQueue')
// export class EmailProcessor extends WorkerHost {
//   constructor(
//     private readonly mailerService: MailerService,
//     private readonly configService: ConfigService,
//   ) {
//     super();
//   }

//   // Implementujesz abstrakcyjną metodę process
//   async process(job: Job<RepairsFormDto>) {
//     console.log(`Dane: ${JSON.stringify(job.data)}`);
//     const data = job.data;

//     try {
//       await this.mailerService.sendMail({
//         replyTo: data.email,
//         to: `Repear.pl - Serwis urządzeń Apple <${this.configService.get<string>('MAILER_USER')}>`,
//         subject: `Nowe zgłoszenie naprawy: ${data.serialNumber}`,
//         template: 'repair-form',
//         context: {
//           email: data.email,
//           description: data.description,
//           serialNumber: data.serialNumber,
//           phone: data.phone,
//           name: data.name,
//         },
//       });
//       console.log(`Email wysłany do ${data.email}`);

//       await this.mailerService.sendMail({
//         to: data.email,
//         subject: `Potwierdzenie zgłoszenia naprawy: ${data.serialNumber}`,
//         template: 'thank-you-repair-form',
//         context: {
//           email: data.email,
//           serialNumber: data.serialNumber,
//           phone: data.phone,
//           description: data.description,
//           name: data.name,
//         },
//       });
//     } catch (error) {
//       console.error(`Błąd podczas wysyłania emaili: ${error.message}`);
//     }
//   }
// }

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ResendService } from 'nestjs-resend';
import { Job } from 'bullmq';
import { RepairsFormDto } from 'src/repairs/dto/form-repair.dto';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { Resend } from 'resend';

@Processor('emailQueue')
export class EmailProcessor extends WorkerHost {
  constructor(
    @Inject('RESEND_CLIENT') private readonly resend: Resend,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<RepairsFormDto>) {
    console.log(`Dane: ${JSON.stringify(job.data)}`);
    const data = job.data;

    try {
      // Email do serwisu
      await this.resend.emails.send({
        from: `Formularz - Repear.pl <${this.configService.get<string>('MAILER_FROM_ADDRESS')}>`,
        to: `Serwis - Repear.pl <${this.configService.get<string>('MAILER_USER')}>`,
        replyTo: data.email,
        subject: `Nowe zgłoszenie naprawy: ${data.serialNumber}`,
        html: `
          <h2>Nowe zgłoszenie naprawy</h2>
          <p><strong>Imię:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <p><strong>Numer seryjny:</strong> ${data.serialNumber}</p>
          <p><strong>Opis:</strong> ${data.description}</p>
        `,
      });

      console.log(`Email wysłany do serwisu`);

      // Email potwierdzający do klienta
      await this.resend.emails.send({
        from: `No-reply - Repear.pl <${this.configService.get<string>('MAILER_FROM_ADDRESS')}>`,
        to: data.email,
        subject: `Potwierdzenie zgłoszenia naprawy: ${data.serialNumber}`,
        html: `
          <h2>Dziękujemy za zgłoszenie!</h2>
          <p>Witaj ${data.name},</p>
          <p>Otrzymaliśmy Twoje zgłoszenie naprawy urządzenia o numerze seryjnym: <strong>${data.serialNumber}</strong></p>
          <p>Skontaktujemy się z Tobą wkrótce pod numerem: ${data.phone}</p>
        `,
      });
    } catch (error) {
      console.error(`Błąd podczas wysyłania emaili: ${error.message}`);
    }
  }
}
