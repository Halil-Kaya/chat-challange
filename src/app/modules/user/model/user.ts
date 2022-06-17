import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from "mongoose";

@Schema({
  versionKey: false,
  timestamps: true
})
export class User{
  @Prop({
    type: String,
    unique : true,
    required: true
  })
  email: string;

  @Prop({
    type: String,
    select: false,
    required : false
  })
  password: string;

  @Prop({
    type : Boolean,
    default : false
  })
  isLoggin : boolean

  @Prop({
    type : Boolean,
    default : false
  })
  isOnline : boolean
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

export interface SanitizedUser {
  _id: Types.ObjectId
}