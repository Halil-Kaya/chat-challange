import { CreateMessageDto } from "@modules/chat/dto/create-message.dto";
import { FetchUnseenMessagesDto } from "@modules/chat/dto/fetch-unseen-messages.dto";
import { PaginationInfo } from "@modules/chat/dto/pagination-info.dto";
import { Message, MessageDocument } from "@modules/chat/model/message";
import { UserDocument } from "@modules/user/model/user";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Environment } from "@source/config/environment";
import { Model, Types, FilterQuery } from "mongoose";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly configService: ConfigService<Environment>
  ) {}

  public async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    return this.messageModel.create(createMessageDto);
  }

  public async makeSeenMessages(user: UserDocument, messageIdsToBeSeen: Types.ObjectId[]): Promise<void> {
    await this.messageModel
      .updateMany(
        {
          _id   : { $in: messageIdsToBeSeen },
          sender: { $ne: user._id }
        }, {
          $addToSet: { seenByList: user._id }
        });
  }

  public async getUnseenMessagesOfUser(currentUser: UserDocument, friendIdsOfUser: Types.ObjectId[], page: number): Promise<FetchUnseenMessagesDto> {
    const query: FilterQuery<MessageDocument> = {
      sender    : { $in: friendIdsOfUser },
      seenByList: { $nin: [ currentUser._id ] }
    };
    const paginationInfo = new PaginationInfo();
    await this.updatePaginationForQuery(paginationInfo, query);
    const messages = await this.messageModel.find(query)
      .skip(paginationInfo.offset)
      .limit(paginationInfo.limit)
      .select([ "_id", "body" ]).lean();
    return {
      messages      : messages,
      paginationInfo: paginationInfo
    };
  }

  private async updatePaginationForQuery(pagination: PaginationInfo, query: FilterQuery<MessageDocument>): Promise<void> {
    pagination.totalItemCount = await this.messageModel.countDocuments(query);
    pagination.limit = this.configService.get("PAGINATION_LIMIT");
    pagination.offset = pagination?.offset ? pagination.offset : 0;
    pagination.count = pagination.totalItemCount == pagination.limit ? 0 : Math.floor(pagination.totalItemCount / pagination.limit);
    pagination.hasNext = pagination.count > 0;
  }
}