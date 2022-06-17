import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { checkResult, CheckType } from "@helpers/check.result";
import { JWTTokenHelper, SignResponse } from "@helpers/jwt.token.helper";
import LoginDto from "@modules/auth/dto/login.dto";
import { UserDocument, SanitizedUser } from "@modules/user/model/user";
import { UserService } from "@modules/user/service/user.service";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService : UserService,
    private readonly tokenHelper: JWTTokenHelper,
  ) {}

  public async login(loginDto : LoginDto) : Promise<SignResponse>{
    const user = await this.checkAuthAndGetUser(loginDto)
    const tokens = this.tokenHelper.signUser(user._id);
    user.isLoggin = true
    await user.save()
    return tokens
  }

  public async logout(userDocument : UserDocument) : Promise<void>{
    userDocument.isLoggin = false;
    userDocument.isOnline = false;
    await userDocument.save()
  }

  public async createUser(createUserDto) : Promise<void>{
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    const createdUser = await this.userService.create(createUserDto)
    checkResult(createdUser,
      CheckType.IS_NULL_OR_UNDEFINED,
      ErrorStatus.BAD_REQUEST,
      ErrorMessage.UNEXPECTED)
  }

  public async findUserFromSanitizedUser(sanitizedUser: SanitizedUser){
    return this.userService.findById(sanitizedUser._id);
  }

  private async checkAuthAndGetUser(loginDto: LoginDto): Promise<UserDocument> {
    const user : UserDocument = await this.userService.getUserWithPasswordByEmail(loginDto.email)
    checkResult(user,CheckType.IS_NULL_OR_UNDEFINED, ErrorStatus.BAD_REQUEST, ErrorMessage.INVALID_CREDENTIALS)
    const isPasswordMatch = await AuthService.checkPasswordMatch(loginDto.password, user.password)
    checkResult(isPasswordMatch,CheckType.IS_FALSE, ErrorStatus.BAD_REQUEST, ErrorMessage.INVALID_CREDENTIALS)
    return user;
  }

  private static checkPasswordMatch(password, realPassword): Promise<string> {
    return bcrypt.compare(password, realPassword);
  }
}