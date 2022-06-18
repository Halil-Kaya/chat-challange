import { CreateMessageDto } from "@modules/chat/dto/create-message.dto";
import { Message, MessageDocument } from "@modules/chat/model/message";
import { UserDocument } from "@modules/user/model/user";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>
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

}