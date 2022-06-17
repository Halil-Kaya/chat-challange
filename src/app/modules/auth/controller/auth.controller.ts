import { JWTGuard } from "@guards/jwt.guard";
import { ResponseHelper, DefaultResponse } from "@helpers/response.helper";
import CreateUserDto from "@modules/auth/dto/create-user.dto";
import LoginDto from "@modules/auth/dto/login.dto";
import { AuthService } from "@modules/auth/service/auth.service";
import { Controller, Post, Req, Res, Body, UseGuards } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  private controller = "auth";

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post("create")
  async create(
    @Req() request,
    @Res() response,
    @Body() createUserDto: CreateUserDto
  ) {
    await this.authService.createUser(createUserDto);
    response.json(ResponseHelper.set(
        DefaultResponse.OK,
        {
          controller: this.controller,
          params    : request.params,
          headers   : request.headers
        }
      )
    );
  }

  @Post("login")
  async login(
    @Req() request,
    @Res() response,
    @Body() loginDto: LoginDto
  ) {
    const tokens = await this.authService.login(loginDto);
    response.json(ResponseHelper.set(
        {
          tokens: tokens
        },
        {
          controller: this.controller,
          params    : request.params,
          headers   : request.headers
        }
      )
    );
  }

  @Post("logout")
  @UseGuards(JWTGuard)
  async logout(
    @Req() request,
    @Res() response
  ) {
    await this.authService.logout(request.user);
    response.json(ResponseHelper.set(
        DefaultResponse.OK,
        {
          controller: this.controller,
          params    : request.params,
          headers   : request.headers
        }
      )
    );
  }
}
