import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from '../../entities/users.entity';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([users]), AuthModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
