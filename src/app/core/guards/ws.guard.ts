import { AuthService } from "@modules/auth/service/auth.service";
import { ChatEvent } from "@modules/chat/enums/chat-event.enum";
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger: Logger = new Logger(WsJwtGuard.name);

  constructor(private readonly authService: AuthService) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    try {
      const authToken: string = client.handshake?.headers.authorization
      client.data.user = await this.authService.verifyAndGetUser(authToken);
      return true;
    } catch(err) {
      this.logger.error(err.message);
      client.emit(ChatEvent.UNAUTHORIZED);
      client.disconnect(true)
      throw new WsException(err.message);
    }
  }
}
