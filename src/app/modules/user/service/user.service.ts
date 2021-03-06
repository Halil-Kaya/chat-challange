import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { checkResult, CheckType } from "@helpers/check.result";
import CreateUserDto from "@modules/auth/dto/create-user.dto";
import { User, UserDocument } from "@modules/user/model/user";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  public async getUserWithPasswordByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({
      email: email
    }).select("+password");
  }

  public async findById(_id: Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findById(_id);
  }

  public async checkIfUserExistsById(userId: Types.ObjectId): Promise<void> {
    const isExist = await this.userModel.exists({ _id: userId });
    checkResult(isExist, CheckType.IS_FALSE, ErrorStatus.BAD_REQUEST, ErrorMessage.USER_NOT_FOUND);
  }

  public async findLoggedInUserById(_id: Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findOne({
      _id     : _id,
      isLoggin: true
    });
  }

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }
}