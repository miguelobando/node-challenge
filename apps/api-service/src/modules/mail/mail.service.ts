import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailierService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendEmail(email: string, newPassword: string) {
    try {
      await this.mailierService.sendMail({
        to: email,
        from: `Stock API Password Reset <${this.configService.get(
          'MAIL_USER',
        )}>`,
        subject: 'Reset password Stock API',
        html: `Your new password is <b>${newPassword}</b>`,
      });
    } catch (error) {
      console.log(error);
    } finally {
      return 'Password reset email sent';
    }
  }
}
