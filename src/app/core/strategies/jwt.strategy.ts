import { BaseError } from "@errors/base.error";
import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { AuthService } from "@modules/auth/service/auth.service";
import { SanitizedUser } from "@modules/user/model/user";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { StrategyType } from "@source/app/core/strategies/strategy.enum";
import { Environment } from "@source/config/environment";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(
  Strategy,
  StrategyType.JWT,
) {
  constructor(
    private readonly configService: ConfigService<Environment>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: SanitizedUser, done: Function) {
    try{
      const signedUser = await this.authService.findUserFromSanitizedUser(payload)
      if(!signedUser){
        return done(
          new BaseError(
            ErrorStatus.UNAUTHORIZED,
            ErrorMessage.INVALID_CREDENTIALS,
          ),
          null,
        );
      }
      if(signedUser.isLoggin == false){
        return done(
          new BaseError(
            ErrorStatus.UNAUTHORIZED,
            ErrorMessage.YOU_MUST_LOGIN,
          ),
          null,
        );
      }
      return done(null, signedUser);
    }catch(error){
      throw new BaseError(
        ErrorStatus.UNAUTHORIZED,
        ErrorMessage.UNAUTHORIZED,
        error,
      );
    }
  }
}
