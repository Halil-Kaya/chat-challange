import { RelationshipDocument, Relationship } from "@modules/chat/model/relationship";
import { UserDocument } from "@modules/user/model/user";
import { UserService } from "@modules/user/service/user.service";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, LeanDocument, Types } from "mongoose";

@Injectable()
export class RelationshipService {
  constructor(
    @InjectModel(Relationship.name) private readonly relationshipModel: Model<RelationshipDocument>,
    private readonly userService: UserService
  ) {}

  public async getFriendsOfUser(user: UserDocument): Promise<LeanDocument<RelationshipDocument[]>> {
    return this.relationshipModel.find({
      friend: user._id
    }).select("user").lean();
  }

  public async addToFriends(currentUser: UserDocument, userToBeFriendId: Types.ObjectId): Promise<void> {
    await this.userService.checkIfUserExistsById(userToBeFriendId);
    const isUserAlreadyFriend = await this.isUserAlreadyFriend(currentUser._id, userToBeFriendId);
    if (isUserAlreadyFriend) {
      return;
    }
    await this.relationshipModel.create({
      user  : currentUser._id,
      friend: userToBeFriendId
    });
  }

  public async removeFromFriends(currentUser: UserDocument, userToUnfriendId: Types.ObjectId): Promise<void> {
    await this.relationshipModel.deleteOne({
      user  : currentUser,
      friend: userToUnfriendId
    });
  }

  private async isUserAlreadyFriend(currentUser: Types.ObjectId, usertToBeFriendId: Types.ObjectId): Promise<boolean> {
    return await this.relationshipModel.exists({
      user  : currentUser,
      friend: usertToBeFriendId
    });
  }
}