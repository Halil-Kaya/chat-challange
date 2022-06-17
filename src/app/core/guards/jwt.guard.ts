import { BaseError } from "@errors/base.error";
import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { AuthService } from "@modules/auth/service/auth.service";
import { ExecutionContext, Injectable, CanActivate } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StrategyType } from "@source/app/core/strategies/strategy.enum";

@Injectable()
export class JWTGuard
  extends AuthGuard(StrategyType.JWT)
  implements CanActivate
{
  constructor(readonly authService: AuthService) {
    super();
    if (!this.authService) {
      throw new BaseError(
        ErrorStatus.INTERNAL_SERVER_ERROR,
        ErrorMessage.JWT_USER_GUARD_CAN_NOT_BE_INSTANTIATED,
      );
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtActivation = await super.canActivate(context);
    return !!jwtActivation
  }
}
