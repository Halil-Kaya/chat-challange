import { ErrorMessage } from "@errors/error.message";
import { ErrorStatus } from "@errors/error.status";
import { checkResult, CheckType } from "@helpers/check.result";
import { JWTTokenHelper, SignResponse } from "@helpers/jwt.token.helper";
import LoginDto from "@modules/auth/dto/login.dto";
import { UserDocument, SanitizedUser } from "@modules/user/model/user";
import { UserService } from "@modules/user/service/user.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Environment } from "@source/config/environment";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Environment>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenHelper: JWTTokenHelper
  ) {}

  public async login(loginDto: LoginDto): Promise<SignResponse> {
    const user: UserDocument = await this.checkAuthAndGetUser(loginDto);
    const tokens: SignResponse = this.tokenHelper.signUser(user._id);
    user.isLoggin = true;
    await user.save();
    return tokens;
  }

  public async logout(userDocument: UserDocument): Promise<void> {
    userDocument.isLoggin = false;
    await userDocument.save();
  }

  public async createUser(createUserDto): Promise<void> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    const createdUser: UserDocument = await this.userService.create(createUserDto);
    checkResult(createdUser,
      CheckType.IS_NULL_OR_UNDEFINED,
      ErrorStatus.BAD_REQUEST,
      ErrorMessage.UNEXPECTED);
  }

  public async findUserFromSanitizedUser(sanitizedUser: SanitizedUser) {
    return this.userService.findById(sanitizedUser._id);
  }

  public async verifyAndGetUser(authToken: string): Promise<UserDocument> {
    const user: SanitizedUser = await this.jwtService.verifyAsync(authToken, {
      secret          : this.configService.get("JWT_SECRET"),
      ignoreExpiration: false
    });
    return this.signByJwt(user);
  }

  private async signByJwt(sanitizedUser: SanitizedUser): Promise<UserDocument> {
    const user: UserDocument = await this.userService.findLoggedInUserById(sanitizedUser._id);
    checkResult(user,
      CheckType.IS_NULL_OR_UNDEFINED,
      ErrorStatus.BAD_REQUEST,
      ErrorMessage.UNAUTHORIZED);
    return user;
  }

  private async checkAuthAndGetUser(loginDto: LoginDto): Promise<UserDocument> {
    const user: UserDocument = await this.userService.getUserWithPasswordByEmail(loginDto.email);
    checkResult(user, CheckType.IS_NULL_OR_UNDEFINED, ErrorStatus.BAD_REQUEST, ErrorMessage.INVALID_CREDENTIALS);
    const isPasswordMatch: boolean = await AuthService.checkPasswordMatch(loginDto.password, user.password);
    checkResult(isPasswordMatch, CheckType.IS_FALSE, ErrorStatus.BAD_REQUEST, ErrorMessage.INVALID_CREDENTIALS);
    return user;
  }

  private static checkPasswordMatch(password, realPassword): Promise<boolean> {
    return bcrypt.compare(password, realPassword);
  }
}