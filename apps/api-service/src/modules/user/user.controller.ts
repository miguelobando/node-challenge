import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response as responseType } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'User created successfully',
  })
  @ApiOperation({ summary: 'Register a user and return an random password' })
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto, @Res() res: responseType) {
    return this.userService.create(createUserDto, res);
  }

  @ApiResponse({
    status: 200,
    description: 'User logged successfully and token returned',
  })
  @ApiOperation({ summary: 'Login an user and generate a token' })
  @Post('/login')
  login(@Body() userLogin: LoginUserDto, @Res() res: responseType) {
    return this.userService.login(userLogin, res);
  }

  @ApiOperation({
    summary: 'Reset the password of an user and send it via email',
  })
  @Post('/reset-password')
  resetPassword(@Body() data: ResetPasswordDto, @Res() res: responseType) {
    return this.userService.resetPassword(data.email, res);
  }
}
