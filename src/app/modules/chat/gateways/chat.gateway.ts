import { ErrorMessage } from "@errors/error.message";
import { WsJwtGuard } from "@guards/ws.guard";
import { AddToFriendsDto } from "@modules/chat/dto/add-to-friends.dto";
import { ChatMessageMakeSeenDto } from "@modules/chat/dto/chat-message-make-seen.dto";
import { CreateMessageDto } from "@modules/chat/dto/create-message.dto";
import { RemoveFromFriendsDto } from "@modules/chat/dto/remove-from-friends.dto";
import { ChatEvent } from "@modules/chat/enums/chat-event.enum";
import { ChatService } from "@modules/chat/service/chat.service";
import { UserDocument } from "@modules/user/model/user";
import { RedisCacheService } from "@modules/utils/redis-cache/service/redis-cache.service";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody
} from "@nestjs/websockets";
import { Logger, UseGuards, ValidationPipe } from "@nestjs/common";
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
    private readonly chatService: ChatService,
    private readonly redisCacheService: RedisCacheService
  ) {
  }

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.SEND_MESSAGE_TO_SERVER)
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) createMessageDto: CreateMessageDto) {
    try {
      const user = client.data.user;
      const createdMessage = await this.chatService.createChatMessage(user, createMessageDto);
      this.server.to(user._id.toString()).emit(ChatEvent.SEND_MESSAGE_TO_CLIENT, createdMessage);
    } catch(err) {
      this.logger.error(err, "handleMessage");
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.MESSAGE_MAKE_SEEN_TO_SERVER)
  async handleSeenMessages(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) chatMessageMakeSeenDto: ChatMessageMakeSeenDto) {
    try {
      await this.chatService.chatMakeSeenToMessages(client, chatMessageMakeSeenDto);
    } catch(err) {
      this.logger.error(err, "handleSeenMessages");
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.ADD_TO_FRIENDS)
  async handleAddToFriends(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) addToFriendsDto: AddToFriendsDto): Promise<void> {
    try {
      await this.chatService.handleAddToFriends(client, addToFriendsDto);
    } catch(err) {
      this.logger.error(err, "handleAddToFriends");
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.REMOVE_FROM_FRIENDS)
  async handleRemoveFromFriends(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) removeFromFriendsDto: RemoveFromFriendsDto): Promise<void> {
    try {
      await this.chatService.handleRemoveFromFriends(client, removeFromFriendsDto);
    } catch(err) {
      this.logger.error(err, "handleRemoveFromFriends");
    }
  }

  @SubscribeMessage("test")
  async cacheTest(client: Socket) {
    try {
      await this.redisCacheService.set("test", [ "afasfaf", "asfasf", "1", "2", "3", "4" ]);

    } catch(err) {
      this.logger.error(err, "cacheTest");
    }
  }

  @SubscribeMessage("test_read")
  async readFromCache(client: Socket) {
    try {
      const result = await this.redisCacheService.get("test");
      console.log(result);
    } catch(err) {
      this.logger.error(err, "readFromCache");
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user: UserDocument = await this.chatService.handleConnectionAndReturnUser(client);
      this.server.to(user._id.toString()).emit(ChatEvent.ONLINE_EVENT, user);
    } catch(err) {
      if (err.message == ErrorMessage.UNAUTHORIZED) {
        client.emit(ChatEvent.UNAUTHORIZED);
      }
      this.logger.error(err, "handleConnection");
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = client.data.user;
      this.server.to(user._id.toString()).emit(ChatEvent.DISCONNECT_EVENT, user);
      client.disconnect(true);
    } catch(err) {
      this.logger.error(err, "handleDisconnect");
    }
  }
}