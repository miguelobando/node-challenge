import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { users } from '../../entities/users.entity';
import { Response as responseType } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(users)
    private readonly userRepo: Repository<users>,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    res: responseType,
  ): Promise<responseType> {
    const userCreated = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (userCreated) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User already created',
      });
    }

    const newUser: users = {
      email: createUserDto.email,
      role: createUserDto.role,
      password: Math.random().toString(36).slice(-8),
    };

    try {
      const response = await this.userRepo.save(newUser);
      console.log(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating user',
      });
    }

    return res.status(HttpStatus.CREATED).json({
      email: newUser.email,
      password: newUser.password,
    });
  }

  async login(userData: LoginUserDto, res: responseType) {
    const result = await this.userRepo.findOne({
      where: {
        email: userData.email,
      },
    });

    if (!result) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    if (result.password !== userData.password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Password incorrect' });
    }

    return res.status(HttpStatus.OK).json({
      message: 'Login success',
      token: this.authService.createToken(result.email, result.role),
    });
  }

  async resetPassword(email: string, res: responseType) {
    const newPassword = Math.random().toString(36).slice(-8);
    const result = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });

    if (result) {
      await this.userRepo.update(
        {
          email: email,
        },
        {
          password: newPassword,
        },
      );
      await this.mailService.sendEmail(email, newPassword);
    }

    return res.status(HttpStatus.OK).json({
      message: 'Password reset email sent',
    });
  }
}
