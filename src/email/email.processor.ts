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
      await this.resend.batch.send([
        {
          from: `Formularz - Repear.pl <${this.configService.get<string>('MAILER_FROM_ADDRESS')}>`,
          to: `Serwis - Repear.pl <${this.configService.get<string>('MAILER_USER')}>`,
          replyTo: data.email,
          subject: `Nowe zgłoszenie naprawy: ${data.repairNumber}`,
          html: `
          <h2>Nowe zgłoszenie naprawy</h2>
          <p><strong>Imię:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <p><strong>Numer seryjny:</strong> ${data.serialNumber}</p>
          <p><strong>Opis:</strong> ${data.description}</p>
        `,
        },
        {
          from: `Formularz naprawy - Repear.pl <${this.configService.get<string>('MAILER_FROM_ADDRESS')}>`,
          replyTo: `Serwis - Repear.pl <${this.configService.get<string>('MAILER_USER')}>`,
          to: data.email,
          subject: `${data.repairNumber} Potwierdzenie zgłoszenia naprawy: ${data.serialNumber}`,
          html: `
          <!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 48px 40px; text-align: center; background-color: #00d084;">
              <img src="https://serwis.repear.pl/static/images/logo/logo.png" alt="Repear Logo" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td align="center" style="padding: 40px 40px 0;">
              <div style="width: 64px; height: 64px; background-color: #00d084; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px 40px;">
              <h2 style="margin: 0 0 24px; color: #1a1a1a; font-size: 26px; font-weight: 700; text-align: center;">Dziękujemy za zgłoszenie!</h2>
              
              <p style="margin: 0 0 20px; color: #2d3748; font-size: 16px; line-height: 1.6;">Witaj <strong>${data.name}</strong>,</p>
              
              <p style="margin: 0 0 28px; color: #2d3748; font-size: 16px; line-height: 1.6;">Otrzymaliśmy Twoje zgłoszenie naprawy o numerze <strong style="color: #00d084;">${data.repairNumber}</strong> dla urządzenia o numerze seryjnym: <strong>${data.serialNumber}</strong></p>
              
              <!-- Info Box -->
              <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-left: 4px solid #00d084; border-radius: 8px; margin: 28px 0;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px; color: #1a1a1a; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Numer zgłoszenia</p>
                    <p style="margin: 0; color: #00d084; font-size: 24px; font-weight: 700; font-family: 'Courier New', monospace;">${data.repairNumber}</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 32px 0; border-collapse: collapse; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="https://repear.pl/repair?search=${data.repairNumber}&serial=${data.serialNumber}" style="display: inline-block; padding: 16px 40px; background-color: #00d084; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 208, 132, 0.25);">Śledź status naprawy</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 28px 0 0; color: #4a5568; font-size: 15px; line-height: 1.6; text-align: center;">Skontaktujemy się z Tobą wkrótce pod numerem:<br><strong style="color: #1a1a1a; font-size: 16px;">${data.phone}</strong></p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #e2e8f0;"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 12px; color: #718096; font-size: 14px; line-height: 1.5;">Masz pytania? Odpowiedz na tego maila lub odwiedź naszą stronę.</p>
              <p style="margin: 0 0 16px;">
                 <span style="margin: 0 0 12px; color: #718096; font-size: 14px; line-height: 1.5;"> Napisz do nas: </span>
                <a href="mailto:serwis@repear.pl" style="color: #00d084; text-decoration: none; font-weight: 600; font-size: 14px;"> serwis@repear.pl</a>
                <span style="margin: 0 0 12px; color: #718096; font-size: 14px; line-height: 1.5;"> lub zadzwoń </span>
                <a href="callto:serwis@repear.pl" style="color: #00d084; text-decoration: none; font-weight: 600; font-size: 14px;">tel: 693 661 462</a>
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 13px;">© 2026 Repear. Wszystkie prawa zastrzeżone.</p>
            </td>
          </tr>
        </table>
        
        <!-- Email Footer Note -->
        <table role="presentation" style="width: 600px; max-width: 100%; margin-top: 24px;">
          <tr>
            <td style="padding: 0 20px; text-align: center;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">Ta wiadomość została wysłana automatycznie. Zachowaj ją do celów informacyjnych.</p>
              <img src="https://serwis.repear.pl/static/images/logo/logo-white.png" alt="Repear Logo" style="max-width: 80px; height: auto; margin: 0 auto;">
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
        },
      ]);

      console.log(`Email wysłany do serwisu i klienta`);

      // Email potwierdzający do klienta
    } catch (error) {
      console.error(`Błąd podczas wysyłania emaili: ${error.message}`);
    }
  }
}
