import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { users } from '../../entities/users.entity';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<users>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        MailService,
        AuthService,
        UserService,
        { provide: getRepositoryToken(users), useClass: Repository },
        {
          provide: ConfigService,
          useValue: {
            MAIL_USER: 'TEST@GMAIL.COM',
          },
        },
        {
          provide: MailService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    service = module.get<UserService>(UserService);
    repo = module.get<Repository<users>>(getRepositoryToken(users));
  });

  it('should create a user', async () => {
    const dto = { email: 'test@test.com', role: 'test' };

    jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);

    const savedUser = { ...dto, password: 'randomPassword' };
    jest.spyOn(repo, 'save').mockResolvedValue(savedUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await service.create(dto, res as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      email: dto.email,
      password: expect.any(String),
    });
  });

  it('it should not create a user if email is duplicated', async () => {
    const dto = { email: 'test@test.com', role: 'test' };

    jest.spyOn(repo, 'findOne').mockResolvedValue({
      email: 'testing@email.com',
      password: 'randomPassword',
      role: 'admin',
    });

    const savedUser = { ...dto, password: 'randomPassword' };
    jest.spyOn(repo, 'save').mockResolvedValue(savedUser);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await service.create(dto, res as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  describe('login', () => {
    it('should return "User not found" if the user does not exist', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);
      await service.login(loginUserDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should return "Password incorrect" if the password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user: users = {
        email: loginUserDto.email,
        password: 'wrongpassword',
        role: 'user',
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(user);

      await service.login(loginUserDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Password incorrect',
      });
    });

    it('should return "Login success" if the email and password are correct', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: users = {
        email: loginUserDto.email,
        role: 'user',
        password: loginUserDto.password,
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(authService, 'createToken').mockReturnValueOnce('token');
      await service.login(loginUserDto, response);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: {
          email: loginUserDto.email,
        },
      });
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);

      expect(response.json).toHaveBeenCalledWith({
        message: 'Login success',
        token: 'token',
      });
    });
  });
});
