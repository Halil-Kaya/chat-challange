import { User, UserDocument } from "@modules/user/model/user";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  versionKey: false,
  timestamps: false
})
export class Message {
  @Prop({
    type     : String,
    required : true,
    minlength: 1,
    maxlength: 100
  })
  body: string;

  @Prop({
    type    : Types.ObjectId,
    required: true,
    ref     : User.name,
    set     : v => new Types.ObjectId(v)
  })
  sender: UserDocument["_id"];

  @Prop({
    type   : [ Types.ObjectId ],
    ref    : User.name,
    set    : x => x.map(v => new Types.ObjectId(v)),
    default: []
  })
  seenByList: UserDocument["_id"][];

  @Prop({
    type   : Date,
    default: Date.now
  })
  createdAt: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
