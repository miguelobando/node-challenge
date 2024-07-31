import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { jwtConstants } from './constants';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'this_is_my_config',
    });
  }

  async validate(payload: any) {
    return { userId: payload.email, username: payload.password };
  }
}
