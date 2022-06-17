import CreateUserDto from "@modules/auth/dto/create-user.dto";
import { User, UserDocument } from "@modules/user/model/user";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async getUserWithPasswordByEmail(email : string) : Promise<UserDocument>{
    return this.userModel.findOne({
      email : email
    }).select('+password')
  }

  public async findById(_id : Types.ObjectId){
    return this.userModel.findById(_id)
  }

  public async create(createUserDto : CreateUserDto) : Promise<UserDocument>{
    return this.userModel.create(createUserDto)
  }
}