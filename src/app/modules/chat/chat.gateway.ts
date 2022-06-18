import { ChatService } from "@modules/chat/service/chat.service";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

export enum ChatEvent {

}

@WebSocketGateway(
  {
    cors: {
      origin: "*"
    }
  }
)
export class ChatGateway implements OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService
  ) {
  }

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  handleDisconnect(client: Socket) {
  }

  handleConnection(client: Socket, ...args: any[]) {
  }

}