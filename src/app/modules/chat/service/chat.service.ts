import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { checkResult, CheckType } from "@helpers/check.result";
import { AuthService } from "@modules/auth/service/auth.service";
import { AddToFriendsDto } from "@modules/chat/dto/add-to-friends.dto";
import { ChatMessageMakeSeenDto } from "@modules/chat/dto/chat-message-make-seen.dto";
import { CreateMessageDto } from "@modules/chat/dto/create-message.dto";
import { RemoveFromFriendsDto } from "@modules/chat/dto/remove-from-friends.dto";
import { ChatEvent } from "@modules/chat/enums/chat-event.enum";
import { MessageDocument } from "@modules/chat/model/message";
import { MessageService } from "@modules/chat/service/message.service";
import { RelationshipService } from "@modules/chat/service/relationship.service";
import { UserDocument } from "@modules/user/model/user";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { Socket } from "socket.io";

@Injectable()
export class ChatService {
  constructor(
    private readonly relationshipService: RelationshipService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService
  ) {}

  public async createChatMessage(user: UserDocument, createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const createdMessage = await this.messageService.createMessage({
      body  : createMessageDto.body,
      sender: user._id
    });
    checkResult(createMessageDto,
      CheckType.IS_NULL_OR_UNDEFINED,
      ErrorStatus.BAD_REQUEST,
      ErrorMessage.UNEXPECTED);
    return createdMessage;
  }

  public async chatMakeSeenToMessages(client: Socket, chatMessageMakeSeenDto: ChatMessageMakeSeenDto): Promise<void> {
    const user: UserDocument = client.data.user._id;
    const targetMessageIds = chatMessageMakeSeenDto.messageIds.map(messageId => new Types.ObjectId(messageId));
    await this.messageService.makeSeenMessages(user, targetMessageIds);
  }

  public async handleAddToFriends(client: Socket, addToFriendsDto: AddToFriendsDto): Promise<void> {
    const user: UserDocument = client.data.user._id;
    addToFriendsDto.userToBeFriendId = new Types.ObjectId(addToFriendsDto.userToBeFriendId);
    await this.relationshipService.addToFriends(user._id, addToFriendsDto.userToBeFriendId);
    client.join(addToFriendsDto.userToBeFriendId.toString());
    client.emit(ChatEvent.TRANSACTION_SUCCESSFUL);
  }

  public async handleRemoveFromFriends(client: Socket, removeFromFriendsDto: RemoveFromFriendsDto): Promise<void> {
    const user: UserDocument = client.data.user._id;
    removeFromFriendsDto.userToUnfriendId = new Types.ObjectId(removeFromFriendsDto.userToUnfriendId);
    await this.relationshipService.removeFromFriends(user._id, removeFromFriendsDto.userToUnfriendId);
    client.leave(removeFromFriendsDto.userToUnfriendId.toString());
    client.emit(ChatEvent.TRANSACTION_SUCCESSFUL);
  }

  public async handleConnectionAndReturnUser(client: Socket): Promise<UserDocument> {
    const user: UserDocument = await this.authService.verifyAndGetUser(client.handshake.headers.authorization);
    client.data.user = user;
    client.data.userId = user._id.toString();
    const friendsOfUser = await this.relationshipService.getFriendIdsOfUser(user);
    friendsOfUser.forEach(friendUser => {
      client.join(friendUser.user.toString());
    });
    return user;
  }

}