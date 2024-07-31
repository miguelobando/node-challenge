import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtTokenService: JwtService) {}

  createToken(email: string, role: string) {
    const payload = { email, role };
    return this.jwtTokenService.sign(payload);
  }

  decodeToken(token: string) {
    return this.jwtTokenService.decode(token);
  }
}
