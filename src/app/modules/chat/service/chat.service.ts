import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { checkResult, CheckType } from "@helpers/check.result";
import { AuthService } from "@modules/auth/service/auth.service";
import { AddToFriendsDto } from "@modules/chat/dto/add-to-friends.dto";
import { ChatMessageMakeSeenDto } from "@modules/chat/dto/chat-message-make-seen.dto";
import { CreateMessageDto } from "@modules/chat/dto/create-message.dto";
import { FetchUnseenMessagesDto } from "@modules/chat/dto/fetch-unseen-messages.dto";
import { RemoveFromFriendsDto } from "@modules/chat/dto/remove-from-friends.dto";
import { ChatEvent } from "@modules/chat/enums/chat-event.enum";
import { MessageDocument } from "@modules/chat/model/message";
import { MessageService } from "@modules/chat/service/message.service";
import { RelationshipService } from "@modules/chat/service/relationship.service";
import { UserDocument } from "@modules/user/model/user";
import { RedisCacheService } from "@modules/utils/redis-cache/service/redis-cache.service";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { Socket } from "socket.io";

@Injectable()
export class ChatService {
  constructor(
    private readonly relationshipService: RelationshipService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly redisCacheService: RedisCacheService
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
    const user: UserDocument = client.data.user;
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
    const friendIdsOfUser = friendsOfUser.map(friend => friend.user.toString());
    client.join(friendIdsOfUser);
    await this.redisCacheService.set(user._id.toString(), friendIdsOfUser);
    return user;
  }

  public async sendUnseenMessagesToUser(client: Socket, page: number = 0): Promise<void> {
    const user: UserDocument = client.data.user;
    const friendIdsOfUserAsObjectId: Types.ObjectId[] = await this.getFriendsIdsOfUserAsObjectId(user);
    const fetchUnseenMessagesDto: FetchUnseenMessagesDto = await this.messageService.getUnseenMessagesOfUser(user, friendIdsOfUserAsObjectId, page);
    client.emit(ChatEvent.SEND_UNSEEN_MESSAGES_TO_CLIENT, fetchUnseenMessagesDto);
  }

  public async clearFriendsFromCache(user: UserDocument) {
    await this.redisCacheService.delete(user._id.toString());
  }

  private async getFriendsIdsOfUserAsObjectId(user: UserDocument): Promise<Types.ObjectId[]> {
    const friendIdsOfUSer = await this.redisCacheService.get<string[]>(user._id.toString());
    return friendIdsOfUSer.map(friendId => new Types.ObjectId(friendId));
  }

}