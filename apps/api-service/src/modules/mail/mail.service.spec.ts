import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('sendEmail', () => {
    it('should send an email with the new password', async () => {
      const email = 'test@example.com';
      const newPassword = 'newpassword';

      jest.spyOn(configService, 'get').mockReturnValueOnce('test@example.com');
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce({});

      const result = await service.sendEmail(email, newPassword);

      expect(result).toEqual('Password reset email sent');
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        from: 'Stock API Password Reset <test@example.com>',
        subject: 'Reset password Stock API',
        html: `Your new password is <b>${newPassword}</b>`,
      });
    });

    it('should handle errors when sending the email', async () => {
      const email = 'test@example.com';
      const newPassword = 'newpassword';

      jest.spyOn(configService, 'get').mockReturnValueOnce('test@example.com');
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValueOnce(new Error('Failed to send email'));

      const result = await service.sendEmail(email, newPassword);

      expect(result).toEqual('Password reset email sent');
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        from: 'Stock API Password Reset <test@example.com>',
        subject: 'Reset password Stock API',
        html: `Your new password is <b>${newPassword}</b>`,
      });
    });
  });
});
