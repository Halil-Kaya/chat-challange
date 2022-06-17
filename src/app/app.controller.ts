import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('app')
export class AppController {
  private controller = 'app';

  @Get('/')
  async test(
  ) {
      return "test12"
  }
}
