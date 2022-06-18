import { User, UserDocument } from "@modules/user/model/user";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from "mongoose";

@Schema({
  versionKey: false,
  timestamps: false
})
export class Relationship{
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
    set: v => new Types.ObjectId(v)
  })
  user: UserDocument['_id'];

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
    set: v => new Types.ObjectId(v)
  })
  friend: UserDocument['_id'];
}

export type RelationshipDocument = Relationship & Document;
export const RelationshipSchema = SchemaFactory.createForClass(Relationship);
