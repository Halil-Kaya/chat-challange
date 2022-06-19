import { IsMongoId, IsDefined } from "class-validator";
import { Types } from "mongoose";

export class AddToFriendsDto {
  @IsDefined()
  @IsMongoId()
  userToBeFriendId: Types.ObjectId;
}