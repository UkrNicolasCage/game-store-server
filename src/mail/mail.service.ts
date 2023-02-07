import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendActivationMail(to, link) {
    await this.mailerService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Account activation on' + process.env.API_URL,
      text: '',
      html: `
                    <div>
                        <h1>Your activation Link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }
}
