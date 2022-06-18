import { IsMongoId, IsDefined } from "class-validator";
import { Types } from "mongoose";

export class RemoveFromFriendsDto{
  @IsDefined()
  @IsMongoId()
  userToUnfriendId : Types.ObjectId;
}