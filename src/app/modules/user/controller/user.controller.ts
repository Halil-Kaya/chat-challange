import { UserService } from "@modules/user/service/user.service";
import { Controller} from '@nestjs/common';

@Controller('user')
export class UserController {
  private controller = 'user';
  constructor(
    private readonly userService: UserService,
  ) {}



}