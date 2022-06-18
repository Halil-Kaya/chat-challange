import { ErrorMessage } from "@errors/error.message";
import { WsJwtGuard } from "@guards/ws.guard";
import { AuthService } from "@modules/auth/service/auth.service";
import { ChatEvent } from "@modules/chat/enums/chat-event.enum";
import { ChatService } from "@modules/chat/service/chat.service";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer, SubscribeMessage
} from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway(
  {
    cors     : {
      origin: "*"
    },
    namespace: "/socket"
  }
)
export class ChatGateway implements OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService
  ) {
  }

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("test")
  async handleDeleteMessages(client: Socket): Promise<void> {
    try {

    } catch(e) {
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.verifyAndGetUser(client.handshake.headers.authorization);
    } catch(err) {
      if (err.message == ErrorMessage.UNAUTHORIZED) {
        client.emit(ChatEvent.UNAUTHORIZED);
      }
      this.logger.error(err);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      client.disconnect(true);
    } catch(err) {

    }
  }
}