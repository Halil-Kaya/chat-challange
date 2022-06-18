import { ErrorMessage } from "@errors/error.message";
import { WsJwtGuard } from "@guards/ws.guard";
import { AuthService } from "@modules/auth/service/auth.service";
import { AddToFriendsDto } from "@modules/chat/dto/add-to-friends.dto";
import { RemoveFromFriendsDto } from "@modules/chat/dto/remove-from-friends.dto";
import { ChatEvent } from "@modules/chat/enums/chat-event.enum";
import { ChatService } from "@modules/chat/service/chat.service";
import { RelationshipService } from "@modules/chat/service/relationship.service";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody
} from "@nestjs/websockets";
import { Logger, UseGuards, ValidationPipe } from "@nestjs/common";
import { Types } from "mongoose";
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
    private readonly relationshipService : RelationshipService,
    private readonly chatService: ChatService,
  ) {
  }

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.ADD_TO_FRIENDS)
  async handleAddToFriends(@ConnectedSocket() client: Socket,@MessageBody(new ValidationPipe()) addToFriendsDto: AddToFriendsDto): Promise<void> {
    try {
      addToFriendsDto.userToBeFriendId = new Types.ObjectId(addToFriendsDto.userToBeFriendId)
      await this.relationshipService.addToFriends(client.data.user._id,addToFriendsDto.userToBeFriendId)
      client.join(addToFriendsDto.userToBeFriendId.toString())
      client.emit(ChatEvent.TRANSACTION_SUCCESSFUL)
    } catch(err) {
      this.logger.error(err,'handleAddToFriends');
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.REMOVE_FROM_FRIENDS)
  async handleRemoveFromFriends(@ConnectedSocket() client: Socket,@MessageBody(new ValidationPipe()) removeFromFriendsDto: RemoveFromFriendsDto): Promise<void> {
    try {
      removeFromFriendsDto.userToUnfriendId = new Types.ObjectId(removeFromFriendsDto.userToUnfriendId)
      await this.relationshipService.removeFromFriends(client.data.user._id,removeFromFriendsDto.userToUnfriendId)
      client.leave(removeFromFriendsDto.userToUnfriendId.toString())
      client.emit(ChatEvent.TRANSACTION_SUCCESSFUL)
    } catch(err) {
      this.logger.error(err,'handleRemoveFromFriends');
    }
  }

  @SubscribeMessage('test')
  async test(@ConnectedSocket() client: Socket){
    this.server.to('test_room').emit('test_room_apply',"hello")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.authService.verifyAndGetUser(client.handshake.headers.authorization);
      client.data.user = user
      client.data.userId = user._id.toString()
      const friendsOfUser = await this.relationshipService.getFriendIdsOfUser(user)
      friendsOfUser.forEach(friendUser => {
        client.join(friendUser.user.toString())
      })
      this.server.to(user._id.toString()).emit(ChatEvent.ONLINE_EVENT,user)
    } catch(err) {
      if (err.message == ErrorMessage.UNAUTHORIZED) {
        client.emit(ChatEvent.UNAUTHORIZED);
      }
      this.logger.error(err,'handleConnection');
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = client.data.user
      this.server.to(user._id.toString()).emit(ChatEvent.DISCONNECT_EVENT,user)
      client.disconnect(true);
    } catch(err) {
      this.logger.error(err,'handleDisconnect');
    }
  }
}